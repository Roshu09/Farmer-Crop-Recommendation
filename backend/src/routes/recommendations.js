import express from "express"
import { getRecommendations, getRecommendationHistory } from "../controllers/recommendationController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.get("/", authenticate, getRecommendations)
router.get("/history", authenticate, getRecommendationHistory)

export default router
