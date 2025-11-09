import { getWeatherData, getWeatherForecast, getSeason } from "../services/weatherService.js"
import Farm from "../models/Farm.js"

export const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.query

    if (!city) {
      return res.status(400).json({ error: "City parameter is required" })
    }

    console.log(`[v0] Fetching weather for city: ${city}`)

    const weatherData = await getWeatherData(null, null, city)

    if (!weatherData) {
      return res.status(500).json({ error: "Failed to fetch weather data" })
    }

    res.json({ weather: weatherData })
  } catch (error) {
    console.error("[v0] Error in getWeatherByCity:", error)
    next(error)
  }
}

export const getCurrentWeather = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })

    if (!farm || !farm.location.coordinates) {
      return res.status(400).json({ error: "Farm location not set" })
    }

    const weatherData = await getWeatherData(farm.location.coordinates.latitude, farm.location.coordinates.longitude)

    if (!weatherData) {
      return res.status(500).json({ error: "Failed to fetch weather data" })
    }

    // Update farm with latest weather
    farm.weather = { ...weatherData, lastUpdated: new Date() }
    await farm.save()

    res.json({ weather: weatherData })
  } catch (error) {
    next(error)
  }
}

export const getWeatherForecastData = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })

    if (!farm || !farm.location.coordinates) {
      return res.status(400).json({ error: "Farm location not set" })
    }

    const forecast = await getWeatherForecast(farm.location.coordinates.latitude, farm.location.coordinates.longitude)

    if (!forecast) {
      return res.status(500).json({ error: "Failed to fetch forecast" })
    }

    res.json({ forecast })
  } catch (error) {
    next(error)
  }
}

export const getSeasonInfo = async (req, res, next) => {
  try {
    const season = getSeason()
    res.json({ season })
  } catch (error) {
    next(error)
  }
}
