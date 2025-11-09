import MarketPrice from "../models/MarketPrice.js"
import { getMarketTrends, updateMarketPrices } from "../services/marketService.js"

export const getMarketPrices = async (req, res, next) => {
  try {
    console.log("[v0] Getting market prices")

    await updateMarketPrices()

    let prices = await MarketPrice.find().lean()

    if (prices.length === 0) {
      console.log("[v0] No market prices found in database, generating mock data")
      prices = generateMockMarketData()
    }

    const formattedPrices = prices.map((price) => ({
      id: price._id?.toString() || Math.random().toString(),
      cropName: price.cropType,
      price: price.price?.current || price.price || 0,
      priceChange:
        Math.round(((price.price?.current - price.price?.average30Days) / price.price?.average30Days) * 100) || 0,
      trend: price.trend || "stable",
      supply: price.supply || "medium",
      demand: price.demand || "medium",
      quality: "standard",
    }))

    console.log("[v0] Returning", formattedPrices.length, "market prices")
    res.json({ prices: formattedPrices })
  } catch (error) {
    console.error("[v0] Market prices error:", error)
    next(error)
  }
}

export const getCropPrices = async (req, res, next) => {
  try {
    const { cropType } = req.params
    console.log("[v0] Getting price for crop:", cropType)

    let price = await MarketPrice.findOne({ cropType }).lean()

    if (!price) {
      console.log("[v0] Price not found for", cropType, "returning mock data")
      price = generateMockPriceForCrop(cropType)
    }

    res.json({ price })
  } catch (error) {
    console.error("[v0] Get crop price error:", error)
    next(error)
  }
}

export const getMarketAnalysis = async (req, res, next) => {
  try {
    const { cropType } = req.params
    console.log("[v0] Getting market analysis for:", cropType)

    const trends = await getMarketTrends(cropType)

    if (!trends) {
      console.log("[v0] Trends not found, returning mock analysis")
      return res.json({
        analysis: generateMockMarketAnalysis(cropType),
      })
    }

    res.json({ analysis: trends })
  } catch (error) {
    console.error("[v0] Market analysis error:", error)
    next(error)
  }
}

export const getTopCrops = async (req, res, next) => {
  try {
    console.log("[v0] Getting top crops")

    let topCrops = await MarketPrice.find().sort({ "price.current": -1 }).limit(5).lean()

    if (topCrops.length === 0) {
      console.log("[v0] No top crops found, returning mock data")
      topCrops = generateMockTopCrops()
    }

    console.log("[v0] Returning", topCrops.length, "top crops")
    res.json({ topCrops })
  } catch (error) {
    console.error("[v0] Top crops error:", error)
    next(error)
  }
}

const generateMockMarketData = () => {
  const crops = ["wheat", "rice", "corn", "potato", "tomato", "onion", "carrot", "spinach"]
  return crops.map((crop) => generateMockPriceForCrop(crop))
}

const generateMockPriceForCrop = (cropType) => {
  const basePrice = Math.floor(100 + Math.random() * 300)
  return {
    cropType,
    price: {
      current: basePrice,
      min30Days: Math.round(basePrice * 0.85),
      max30Days: Math.round(basePrice * 1.15),
      average30Days: Math.round(basePrice * 0.95),
    },
    demand: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    supply: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
    topMarkets: [
      { city: "Delhi", price: basePrice + 10, demand: "high" },
      { city: "Mumbai", price: basePrice - 5, demand: "medium" },
      { city: "Bangalore", price: basePrice + 15, demand: "high" },
    ],
    lastUpdated: new Date(),
  }
}

const generateMockTopCrops = () => {
  const topCrops = ["wheat", "rice", "corn"]
  return topCrops.map((crop) => generateMockPriceForCrop(crop))
}

const generateMockMarketAnalysis = (cropType) => {
  const basePrice = Math.floor(100 + Math.random() * 300)
  return {
    cropType,
    currentPrice: basePrice,
    priceHistory: [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), price: Math.round(basePrice * 0.85) },
      { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), price: Math.round(basePrice * 0.95) },
      { date: new Date(), price: basePrice },
    ],
    demand: "high",
    supply: "medium",
    trend: "stable",
    bestSellingMarkets: [
      { city: "Delhi", price: basePrice + 10, demand: "high" },
      { city: "Mumbai", price: basePrice - 5, demand: "medium" },
    ],
  }
}
