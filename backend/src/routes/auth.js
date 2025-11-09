import express from "express"
import { signup, login, getProfile, updateProfile } from "../controllers/authController.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

router.post("/signup", (req, res, next) => {
  console.log("[v0] Signup request:", {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    location: req.body.location,
  })
  signup(req, res, next)
})

router.post("/login", login)
router.get("/profile", authenticate, getProfile)
router.put("/profile", authenticate, updateProfile)

export default router
