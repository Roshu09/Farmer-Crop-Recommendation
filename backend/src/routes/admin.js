import express from "express"
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  manageCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getSystemLogs,
  getSystemMetrics,
} from "../controllers/adminController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate, authorize("admin"))

// Stats and metrics
router.get("/stats", getAdminStats)
router.get("/metrics", getSystemMetrics)
router.get("/logs", getSystemLogs)

// User management
router.get("/users", getAllUsers)
router.delete("/users/:userId", deleteUser)

// Crop management
router.get("/crops", manageCrops)
router.post("/crops", createCrop)
router.put("/crops/:cropId", updateCrop)
router.delete("/crops/:cropId", deleteCrop)

export default router
