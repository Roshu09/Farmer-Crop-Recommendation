import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from "./src/routes/auth.js"
import farmerRoutes from "./src/routes/farmer.js"
import adminRoutes from "./src/routes/admin.js"
import weatherRoutes from "./src/routes/weather.js"
import recommendationRoutes from "./src/routes/recommendations.js"
import marketRoutes from "./src/routes/market.js"
import analyticsRoutes from "./src/routes/analytics.js"

// Import middleware
import errorHandler from "./src/middleware/errorHandler.js"

const app = express()

// Middleware
app.use(express.json())

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err.message))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/farmer", farmerRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/recommendations", recommendationRoutes)
app.use("/api/market", marketRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running", timestamp: new Date() })
})

app.get("/", (req, res) => {
  res.json({
    message: "Crop Recommendation System API",
    version: "1.0.0",
    status: "running",
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})
