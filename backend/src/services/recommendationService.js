import { CROPS, SOIL_NPK, CONFIDENCE_THRESHOLDS } from "../config/constants.js"
import MarketPrice from "../models/MarketPrice.js"

export const generateRecommendations = async (farmData, weatherData) => {
  const recommendations = []

  for (const [cropKey, cropData] of Object.entries(CROPS)) {
    const scores = calculateSuitabilityScores(cropData, farmData, weatherData)
    const totalScore = Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length

    if (totalScore >= CONFIDENCE_THRESHOLDS.LOW) {
      const marketData = await MarketPrice.findOne({ cropType: cropKey })
      const estimatedYield = calculateYield(cropData, scores)

      recommendations.push({
        cropType: cropKey,
        suitabilityScore: Math.round(totalScore * 100),
        confidence: calculateConfidence(totalScore),
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
    soil: Math.min(soil, 1),
    weather: Math.min(weather, 1),
    season: Math.min(season, 1),
    market: Math.min(market, 1),
  }
}

const calculateSoilScore = (cropData, soilData) => {
  let score = 0.5

  // pH check
  if (soilData.ph >= cropData.soilPHRange.min && soilData.ph <= cropData.soilPHRange.max) {
    score += 0.2
  }

  // NPK check
  if (soilData.nitrogen >= SOIL_NPK.NITROGEN.low) score += 0.1
  if (soilData.phosphorus >= SOIL_NPK.PHOSPHORUS.low) score += 0.1
  if (soilData.potassium >= SOIL_NPK.POTASSIUM.low) score += 0.1

  return score
}

const calculateWeatherScore = (cropData, weatherData) => {
  let score = 0.5

  if (
    weatherData.temperature >= cropData.temperatureRange.min &&
    weatherData.temperature <= cropData.temperatureRange.max
  ) {
    score += 0.25
  }

  if (weatherData.humidity >= cropData.moistureRange.min && weatherData.humidity <= cropData.moistureRange.max) {
    score += 0.25
  }

  return score
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
  if (score >= 0.8) return "high"
  if (score >= 0.6) return "medium"
  return "low"
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
