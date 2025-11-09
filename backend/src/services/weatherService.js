import axios from "axios"

const WEATHER_API = "https://api.weatherapi.com/v1"

export const getWeatherData = async (latitude = null, longitude = null, cityName = null) => {
  try {
    // Use city name if provided, otherwise fallback to coordinates or default
    const location = cityName || (latitude && longitude ? `${latitude},${longitude}` : "Delhi")

    console.log("[v0] Fetching weather for location:", location)
    console.log("[v0] WeatherAPI key exists:", !!process.env.WEATHERAPI_KEY)

    if (!process.env.WEATHERAPI_KEY) {
      console.warn("[v0] WEATHERAPI_KEY not configured, returning default weather data")
      return getDefaultWeatherData()
    }

    const response = await axios.get(`${WEATHER_API}/current.json`, {
      params: {
        key: process.env.WEATHERAPI_KEY,
        q: location,
        aqi: "yes",
      },
    })

    console.log("[v0] Weather API response received successfully")
    const data = response.data
    const current = data.current

    return {
      temperature: Math.round(current.temp_c),
      humidity: current.humidity,
      rainfall: current.precip_mm || 0,
      windSpeed: Math.round(current.wind_kph),
      condition: current.condition.text,
      description: current.condition.text,
      pressure: current.pressure_mb,
      feelsLike: Math.round(current.feelslike_c),
      uvIndex: current.uv,
      cloudCover: current.cloud,
      visibility: current.vis_km,
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
      },
    }
  } catch (error) {
    console.error("[v0] Weather API error:", error.message)
    console.log("[v0] Returning default weather data due to API error")
    return getDefaultWeatherData()
  }
}

const getDefaultWeatherData = () => {
  return {
    temperature: 28,
    humidity: 65,
    rainfall: 5,
    windSpeed: 12,
    condition: "Partly Cloudy",
    description: "Partly Cloudy (Demo Data)",
    pressure: 1013,
    feelsLike: 27,
    uvIndex: 6,
    cloudCover: 25,
    visibility: 10,
    location: {
      name: "Demo Location",
      region: "Demo Region",
      country: "India",
    },
  }
}

export const getWeatherForecast = async (cityName = "Delhi", days = 5) => {
  try {
    console.log("[v0] Fetching forecast for:", { cityName, days })

    if (!process.env.WEATHERAPI_KEY) {
      console.warn("[v0] WEATHERAPI_KEY not configured, returning default forecast")
      return getDefaultForecast(days)
    }

    const response = await axios.get(`${WEATHER_API}/forecast.json`, {
      params: {
        key: process.env.WEATHERAPI_KEY,
        q: cityName,
        days: Math.min(days, 10),
        aqi: "yes",
      },
    })

    const forecast = response.data.forecast.forecastday.map((day) => ({
      date: new Date(day.date),
      temperature: Math.round(day.day.avgtemp_c),
      humidity: day.day.avghumidity,
      rainfall: day.day.totalprecip_mm || 0,
      windSpeed: Math.round(day.day.maxwind_kph),
      condition: day.day.condition.text,
      uvIndex: day.day.uv,
    }))

    return forecast
  } catch (error) {
    console.error("[v0] Forecast API error:", error.message)
    return getDefaultForecast(days)
  }
}

const getDefaultForecast = (days) => {
  const forecast = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    forecast.push({
      date,
      temperature: 25 + Math.random() * 5,
      humidity: 60 + Math.random() * 20,
      rainfall: Math.random() * 10,
      windSpeed: 10 + Math.random() * 5,
      condition: ["Clear", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
      uvIndex: Math.random() * 10,
    })
  }
  return forecast
}

export const getSeason = () => {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "monsoon"
  return "winter"
}
