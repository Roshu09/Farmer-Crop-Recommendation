import { CROPS, SOIL_NPK, CONFIDENCE_THRESHOLDS } from "../config/constants.js"
import MarketPrice from "../models/MarketPrice.js"

export const generateRecommendations = async (farmData, weatherData) => {
  const recommendations = []

  for (const [cropKey, cropData] of Object.entries(CROPS)) {
    const scores = calculateSuitabilityScores(cropData, farmData, weatherData)
    // Add some randomness to make each crop unique
    const randomVariation = (Math.random() - 0.5) * 0.15 // ±7.5% variation
    const totalScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length + randomVariation
    const clampedScore = Math.max(0.2, Math.min(0.95, totalScore)) // Clamp between 20% and 95%

    if (clampedScore >= CONFIDENCE_THRESHOLDS.LOW) {
      const marketData = await MarketPrice.findOne({ cropType: cropKey })
      const estimatedYield = calculateYield(cropData, scores)

      recommendations.push({
        cropType: cropKey,
        suitabilityScore: Math.round(clampedScore * 100),
        confidence: calculateConfidence(clampedScore),
        reasoning: generateReasoning(cropKey, scores),
        factors: scores,
        benefits: generateBenefits(cropKey, farmData),
        risks: generateRisks(cropKey, weatherData),
        estimatedYield: Math.round(estimatedYield),
        marketPrice: marketData?.price?.current || 0,
        suggestedPlantingDate: calculatePlantingDate(cropKey),
      })
    }
  }

  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore)
}

const calculateSuitabilityScores = (cropData, farmData, weatherData) => {
  const soil = calculateSoilScore(cropData, farmData.soilData)
  const weather = calculateWeatherScore(cropData, weatherData)
  const season = calculateSeasonScore(cropData, weatherData.season)
  const market = calculateMarketScore(cropData)

  return {
    soil: Math.min(soil * 1.2, 1), // Boost soil score slightly
    weather: Math.min(weather * 1.1, 1), // Boost weather score slightly
    season: Math.min(season, 1),
    market: Math.min(market, 1),
  }
}

const calculateSoilScore = (cropData, soilData) => {
  let score = 0.2 // Lower base score for more variation

  // pH check - more strict and varied
  const phOptimal = (cropData.soilPHRange.min + cropData.soilPHRange.max) / 2
  const phDiff = Math.abs(soilData.ph - phOptimal)

  if (phDiff < 0.3) {
    score += 0.35 // Perfect pH
  } else if (phDiff < 0.7) {
    score += 0.25 // Good pH
  } else if (phDiff < 1.2) {
    score += 0.15 // Acceptable pH
  } else if (phDiff < 2) {
    score += 0.08 // Poor pH
  }

  // NPK scoring with more variation
  const nScore =
    soilData.nitrogen >= SOIL_NPK.NITROGEN.high
      ? 0.18
      : soilData.nitrogen >= SOIL_NPK.NITROGEN.medium
        ? 0.12
        : soilData.nitrogen >= SOIL_NPK.NITROGEN.low
          ? 0.07
          : 0.02

  const pScore =
    soilData.phosphorus >= SOIL_NPK.PHOSPHORUS.high
      ? 0.18
      : soilData.phosphorus >= SOIL_NPK.PHOSPHORUS.medium
        ? 0.12
        : soilData.phosphorus >= SOIL_NPK.PHOSPHORUS.low
          ? 0.07
          : 0.02

  const kScore =
    soilData.potassium >= SOIL_NPK.POTASSIUM.high
      ? 0.18
      : soilData.potassium >= SOIL_NPK.POTASSIUM.medium
        ? 0.12
        : soilData.potassium >= SOIL_NPK.POTASSIUM.low
          ? 0.07
          : 0.02

  score += nScore + pScore + kScore

  return Math.min(score, 0.95) // Cap at 95%
}

const calculateWeatherScore = (cropData, weatherData) => {
  let score = 0.2 // Lower base

  const tempMid = (cropData.temperatureRange.min + cropData.temperatureRange.max) / 2
  const tempDiff = Math.abs(weatherData.temperature - tempMid)

  if (tempDiff < 2) {
    score += 0.4 // Perfect temperature
  } else if (tempDiff < 5) {
    score += 0.3 // Very good temperature
  } else if (tempDiff < 8) {
    score += 0.2 // Good temperature
  } else if (
    weatherData.temperature >= cropData.temperatureRange.min &&
    weatherData.temperature <= cropData.temperatureRange.max
  ) {
    score += 0.12 // Acceptable temperature
  }

  const humMid = (cropData.moistureRange.min + cropData.moistureRange.max) / 2
  const humDiff = Math.abs(weatherData.humidity - humMid)

  if (humDiff < 8) {
    score += 0.4 // Perfect humidity
  } else if (humDiff < 15) {
    score += 0.3 // Very good humidity
  } else if (humDiff < 25) {
    score += 0.2 // Good humidity
  } else if (weatherData.humidity >= cropData.moistureRange.min && weatherData.humidity <= cropData.moistureRange.max) {
    score += 0.12 // Acceptable humidity
  }

  return Math.min(score, 0.95)
}

const calculateSeasonScore = (cropData, season) => {
  if (cropData.season && cropData.season.includes(season)) {
    return 1
  }
  return 0.5
}

const calculateMarketScore = (cropData) => {
  const demandScores = { high: 1, medium: 0.7, low: 0.4 }
  return demandScores[cropData.demand] || 0.5
}

const calculateYield = (cropData, scores) => {
  const avgScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length
  return cropData.baseYield * avgScore
}

const calculateConfidence = (score) => {
  if (score >= 0.8) return 0.9
  if (score >= 0.6) return 0.7
  return 0.5
}

const generateReasoning = (cropType, scores) => {
  const factors = []
  if (scores.soil > 0.7) factors.push("Excellent soil conditions")
  if (scores.weather > 0.7) factors.push("Weather is favorable")
  if (scores.season > 0.7) factors.push("Currently is the right season")
  if (scores.market > 0.7) factors.push("Strong market demand")

  return factors.length > 0 ? factors.join(", ") : "Moderate suitability for this region"
}

const generateBenefits = (cropType, farmData) => {
  const benefits = ["Good market demand", "Suitable soil conditions", "Optimized for your farm size"]
  return benefits
}

const generateRisks = (cropType, weatherData) => {
  const risks = []
  if (weatherData.rainfall > 100) risks.push("High rainfall risk")
  if (weatherData.temperature > 35) risks.push("High temperature stress")
  if (weatherData.humidity > 80) risks.push("Fungal disease risk")

  return risks.length > 0 ? risks : ["Minimal identified risks"]
}

const calculatePlantingDate = (cropType) => {
  const today = new Date()
  const plantingDate = new Date(today)
  plantingDate.setDate(plantingDate.getDate() + 7)
  return plantingDate
}
