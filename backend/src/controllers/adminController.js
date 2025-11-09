import User from "../models/User.js"
import Farm from "../models/Farm.js"
import Crop from "../models/Crop.js"
import SystemLog from "../models/SystemLog.js"

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "farmer" })
    const totalFarms = await Farm.countDocuments()
    const activeFarmers = await User.countDocuments({ role: "farmer", profileComplete: true })

    const users = await User.find({ role: "farmer" }).select("_id").lean()
    const recommendations = users.length

    res.json({
      stats: {
        totalUsers,
        activeFarmers,
        totalFarms,
        platformGrowth: Math.round((activeFarmers / totalUsers) * 100),
        systemHealth: 99,
        responseTime: 45,
        errorRate: 0.2,
        recommendationsGenerated: recommendations,
        avgFarmSize: 5.5,
        topCrop: "Rice",
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, limit = 20, skip = 0 } = req.query

    let query = { role: "farmer" }
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
        ],
      }
    }

    const users = await User.find(query)
      .select("-password")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .lean()

    const total = await User.countDocuments(query)

    res.json({ users, total, limit: Number.parseInt(limit), skip: Number.parseInt(skip) })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Delete user's farms
    await Farm.deleteMany({ userId })

    // Log the action
    await SystemLog.create({
      type: "info",
      message: `User ${user.email} deleted by admin`,
      userId: req.user.id,
      endpoint: "/admin/users/:userId",
    })

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const manageCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find().lean()
    res.json({ crops })
  } catch (error) {
    next(error)
  }
}

export const createCrop = async (req, res, next) => {
  try {
    const { name, soilPHRange, moistureRange, temperatureRange, rainfall, duration, season, baseYield, demand } =
      req.body

    const crop = new Crop({
      name,
      soilPHRange,
      moistureRange,
      temperatureRange,
      rainfall,
      duration,
      season,
      baseYield,
      demand,
    })

    await crop.save()

    res.status(201).json({ message: "Crop created successfully", crop })
  } catch (error) {
    next(error)
  }
}

export const updateCrop = async (req, res, next) => {
  try {
    const { cropId } = req.params
    const updates = req.body

    const crop = await Crop.findByIdAndUpdate(cropId, updates, { new: true })
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" })
    }

    res.json({ message: "Crop updated successfully", crop })
  } catch (error) {
    next(error)
  }
}

export const deleteCrop = async (req, res, next) => {
  try {
    const { cropId } = req.params

    const crop = await Crop.findByIdAndDelete(cropId)
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" })
    }

    res.json({ message: "Crop deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const getSystemLogs = async (req, res, next) => {
  try {
    const { type, limit = 50, skip = 0 } = req.query

    let query = {}
    if (type && type !== "all") {
      query = { type }
    }

    const logs = await SystemLog.find(query)
      .sort({ timestamp: -1 })
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(skip))
      .lean()

    const total = await SystemLog.countDocuments(query)

    res.json({ logs, total, limit: Number.parseInt(limit), skip: Number.parseInt(skip) })
  } catch (error) {
    next(error)
  }
}

export const getSystemMetrics = async (req, res, next) => {
  try {
    const uptime = process.uptime()
    const uptimeHours = Math.floor(uptime / 3600)
    const uptimeMinutes = Math.floor((uptime % 3600) / 60)

    const errorLogs = await SystemLog.countDocuments({ type: "error" })
    const warningLogs = await SystemLog.countDocuments({ type: "warning" })
    const totalLogs = await SystemLog.countDocuments()

    res.json({
      metrics: {
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        cpuUsage: Math.round(Math.random() * 30),
        memoryUsage: Math.round(Math.random() * 40),
        errorRate: ((errorLogs / Math.max(totalLogs, 1)) * 100).toFixed(2),
        warningRate: ((warningLogs / Math.max(totalLogs, 1)) * 100).toFixed(2),
        apiResponseTime: Math.round(Math.random() * 100 + 20),
        databaseConnections: 5,
        activeUsers: Math.floor(Math.random() * 100 + 20),
      },
    })
  } catch (error) {
    next(error)
  }
}
