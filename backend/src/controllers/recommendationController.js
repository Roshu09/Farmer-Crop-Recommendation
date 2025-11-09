import { generateRecommendations } from "../services/recommendationService.js"
import Recommendation from "../models/Recommendation.js"
import Farm from "../models/Farm.js"
import { getWeatherData, getSeason } from "../services/weatherService.js"
import User from "../models/User.js"

export const getRecommendations = async (req, res, next) => {
  try {
    console.log("[v0] Getting recommendations for user:", req.user.id)

    let farm = await Farm.findOne({ userId: req.user.id })

    if (!farm) {
      console.log("[v0] No farm found for user, creating default farm for recommendations")
      const user = await User.findById(req.user.id)

      farm = {
        _id: `default-${req.user.id}`,
        userId: req.user.id,
        name: "Default Farm",
        soilData: {
          ph: 7.0,
          nitrogen: 50,
          phosphorus: 25,
          potassium: 200,
          moisture: 60,
          organicMatter: 2.5,
        },
        location: user?.location
          ? {
              state: user.location.state,
              district: user.location.district,
              coordinates: {
                latitude: 28.7041,
                longitude: 77.1025,
              },
            }
          : {
              state: "Uttar Pradesh",
              district: "Kanpur",
              coordinates: {
                latitude: 28.7041,
                longitude: 77.1025,
              },
            },
      }
    }

    console.log("[v0] Using farm:", farm._id)

    let cityName = "Delhi"
    if (farm.location && farm.location.district) {
      cityName = farm.location.district
    }

    console.log("[v0] Fetching weather for city:", cityName)

    let weatherData
    try {
      weatherData = await getWeatherData(
        farm.location?.coordinates?.latitude || 28.7041,
        farm.location?.coordinates?.longitude || 77.1025,
        cityName,
      )
      console.log("[v0] Weather data fetched:", weatherData)
    } catch (weatherError) {
      console.error("[v0] Weather fetch failed:", weatherError)
      weatherData = {
        temperature: 25,
        humidity: 65,
        windSpeed: 10,
        condition: "Clear",
        rainfall: 0,
        season: getSeason(),
      }
    }

    weatherData.season = getSeason()
    console.log("[v0] Current season:", weatherData.season)

    let recommendations
    try {
      recommendations = await generateRecommendations(farm, weatherData)
      console.log("[v0] Generated", recommendations.length, "recommendations")
    } catch (recError) {
      console.error("[v0] Recommendation generation failed:", recError)
      return res.status(500).json({
        error: "Failed to generate recommendations",
        message: recError.message || "Please check your farm data and weather service.",
      })
    }

    if (farm._id && !farm._id.toString().startsWith("default-")) {
      try {
        const savedRecommendation = new Recommendation({
          farmId: farm._id,
          userId: req.user.id,
          recommendations,
          weatherData,
          soilData: farm.soilData,
          generatedAt: new Date(),
        })

        await savedRecommendation.save()
      } catch (saveError) {
        console.error("[v0] Failed to save recommendation history:", saveError)
        // Continue even if save fails
      }
    }

    const formattedRecommendations = recommendations.map((rec, idx) => ({
      id: rec.cropType + "-" + idx,
      cropName: rec.cropType.charAt(0).toUpperCase() + rec.cropType.slice(1),
      suitability: rec.suitabilityScore,
      reason: rec.reasoning,
      benefits: rec.benefits,
      riskFactors: rec.risks,
      estimatedYield: rec.estimatedYield + " kg/hectare",
      marketPrice: rec.marketPrice || 5000,
    }))

    res.json({
      recommendations: formattedRecommendations,
      weatherData,
      soilData: farm.soilData,
    })
  } catch (error) {
    console.error("[v0] Recommendation error:", error)
    res.status(500).json({
      error: "Failed to load recommendations",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

export const getRecommendationHistory = async (req, res, next) => {
  try {
    const history = await Recommendation.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10)

    res.json({ history })
  } catch (error) {
    next(error)
  }
}
