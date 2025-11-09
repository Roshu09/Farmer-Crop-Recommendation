import Analytics from "../models/Analytics.js"
import FarmCrop from "../models/FarmCrop.js"

export const generateAnalytics = async (userId, farmId, monthYear) => {
  try {
    const crops = await FarmCrop.find({ farmId })

    const metrics = {
      totalHarvest: crops.filter((c) => c.status === "harvested").length,
      totalYield: crops.reduce((sum, c) => sum + (c.yield?.actual || 0), 0),
      averageYield: crops.length > 0 ? crops.reduce((sum, c) => sum + (c.yield?.actual || 0), 0) / crops.length : 0,
      totalExpenses: crops.reduce((sum, c) => sum + (c.expenses?.total || 0), 0),
      totalRevenue: crops.reduce((sum, c) => sum + (c.revenue || 0), 0),
      profit: 0,
      profitMargin: 0,
      soilHealth: Math.round(Math.random() * 40 + 60),
      waterUsage: Math.round(Math.random() * 5000 + 10000),
      cropsGrown: crops.length,
    }

    metrics.profit = metrics.totalRevenue - metrics.totalExpenses
    metrics.profitMargin = metrics.totalRevenue > 0 ? ((metrics.profit / metrics.totalRevenue) * 100).toFixed(2) : 0

    const cropBreakdown = crops.map((crop) => ({
      cropType: crop.cropType,
      area: crop.area,
      yield: crop.yield?.actual || 0,
      revenue: crop.revenue || 0,
      profit: (crop.revenue || 0) - (crop.expenses?.total || 0),
    }))

    const analytics = new Analytics({
      userId,
      farmId,
      monthYear,
      metrics,
      cropBreakdown,
      weatherImpact: {
        rainfall: Math.round(Math.random() * 500),
        temperature: Math.round(Math.random() * 15 + 20),
        humidity: Math.round(Math.random() * 40 + 40),
        impactScore: Math.random(),
      },
      recommendations: [
        "Optimize irrigation for better water usage",
        "Consider crop rotation for improved soil health",
        "Monitor for pest infestations",
      ],
    })

    return await analytics.save()
  } catch (error) {
    console.error("Error generating analytics:", error)
    throw error
  }
}

export const getAnalyticsData = async (userId, farmId, timeRange = "6m") => {
  try {
    const query = { userId, farmId }

    if (timeRange === "1m") {
      const currentMonth = new Date().toISOString().slice(0, 7)
      query.monthYear = currentMonth
    } else if (timeRange === "3m") {
      const months = []
      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        months.push(date.toISOString().slice(0, 7))
      }
      query.monthYear = { $in: months }
    }

    const data = await Analytics.find(query).sort({ monthYear: -1 })
    return data
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return null
  }
}
