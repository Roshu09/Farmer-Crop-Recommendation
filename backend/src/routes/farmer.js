import express from "express"
import {
  createFarm,
  getFarmData,
  updateFarmSoilData,
  addCropToFarm,
  getFarmCrops,
  updateCropStatus,
  getDashboardData,
} from "../controllers/farmerController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticate)

router.post("/farm", createFarm)
router.get("/farm", getFarmData)
router.put("/farm/soil-data", updateFarmSoilData)
router.post("/farm/crops", addCropToFarm)
router.get("/farm/crops", getFarmCrops)
router.put("/farm/crops/:cropId", updateCropStatus)
router.get("/dashboard", getDashboardData)

export default router
