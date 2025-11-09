import { generateAnalytics, getAnalyticsData } from "../services/analyticsService.js"
import Farm from "../models/Farm.js"
import Analytics from "../models/Analytics.js"

export const getFarmAnalytics = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const { timeRange = "6m" } = req.query
    const data = await getAnalyticsData(req.user.id, farm._id, timeRange)

    res.json({ analytics: data })
  } catch (error) {
    next(error)
  }
}

export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const { monthYear } = req.query
    if (!monthYear) {
      return res.status(400).json({ error: "monthYear parameter required" })
    }

    const analytics = await Analytics.findOne({
      userId: req.user.id,
      farmId: farm._id,
      monthYear,
    })

    if (!analytics) {
      // Generate new analytics if not found
      const newAnalytics = await generateAnalytics(req.user.id, farm._id, monthYear)
      return res.json({ analytics: newAnalytics })
    }

    res.json({ analytics })
  } catch (error) {
    next(error)
  }
}

export const generateFarmAnalytics = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const { monthYear } = req.body
    if (!monthYear) {
      return res.status(400).json({ error: "monthYear parameter required" })
    }

    const analytics = await generateAnalytics(req.user.id, farm._id, monthYear)
    res.status(201).json({ message: "Analytics generated", analytics })
  } catch (error) {
    next(error)
  }
}

export const getPerformanceMetrics = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const currentMonth = new Date().toISOString().slice(0, 7)
    const analytics = await Analytics.findOne({
      userId: req.user.id,
      farmId: farm._id,
      monthYear: currentMonth,
    })

    if (!analytics) {
      const newAnalytics = await generateAnalytics(req.user.id, farm._id, currentMonth)
      return res.json({ metrics: newAnalytics.metrics })
    }

    res.json({ metrics: analytics.metrics })
  } catch (error) {
    next(error)
  }
}
