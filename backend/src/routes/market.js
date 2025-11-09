import express from "express"
import { getMarketPrices, getCropPrices, getMarketAnalysis, getTopCrops } from "../controllers/marketController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.get("/prices", authenticate, getMarketPrices)
router.get("/top-crops", authenticate, getTopCrops)
router.get("/:cropType", authenticate, getCropPrices)
router.get("/:cropType/analysis", authenticate, getMarketAnalysis)

export default router
