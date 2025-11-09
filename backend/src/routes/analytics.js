import express from "express"
import {
  getFarmAnalytics,
  getMonthlyAnalytics,
  generateFarmAnalytics,
  getPerformanceMetrics,
} from "../controllers/analyticsController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)

router.get("/", getFarmAnalytics)
router.get("/monthly", getMonthlyAnalytics)
router.post("/generate", generateFarmAnalytics)
router.get("/metrics/performance", getPerformanceMetrics)

export default router
