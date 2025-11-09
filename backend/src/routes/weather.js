import express from "express"
import {
  getCurrentWeather,
  getWeatherForecastData,
  getSeasonInfo,
  getWeatherByCity,
} from "../controllers/weatherController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.get("/location", authenticate, getWeatherByCity)

router.get("/current", authenticate, getCurrentWeather)
router.get("/forecast", authenticate, getWeatherForecastData)
router.get("/season", authenticate, getSeasonInfo)

export default router
