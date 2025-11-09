import MarketPrice from "../models/MarketPrice.js"
import { CROPS } from "../config/constants.js"
import axios from "axios"

// Data.gov.in API configuration
const DATA_GOV_API = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

// Crop name mapping from your system to data.gov.in names
const CROP_NAME_MAPPING = {
  rice: "Rice",
  wheat: "Wheat",
  maize: "Maize",
  cotton: "Cotton",
  sugarcane: "Sugarcane",
  potato: "Potato",
  tomato: "Tomato",
  onion: "Onion",
  soybean: "Soyabean",
  groundnut: "Groundnut",
}

export const updateMarketPrices = async () => {
  try {
    console.log("[v0] Starting market price update...")

    for (const [cropKey, cropData] of Object.entries(CROPS)) {
      try {
        // Try to fetch real data from data.gov.in API
        const realPrice = await fetchRealMarketPrice(cropKey)

        if (realPrice) {
          console.log(`[v0] Real market price fetched for ${cropKey}: ₹${realPrice.price.current}`)
          await MarketPrice.findOneAndUpdate({ cropType: cropKey }, realPrice, { upsert: true, new: true })
        } else {
          // Fallback to mock data if API fails
          console.log(`[v0] Using mock data for ${cropKey}`)
          const mockPrice = generateMockPrice(cropKey)
          await MarketPrice.findOneAndUpdate({ cropType: cropKey }, mockPrice, { upsert: true, new: true })
        }
      } catch (error) {
        console.error(`[v0] Error updating price for ${cropKey}:`, error.message)
        // Use mock data on error
        const mockPrice = generateMockPrice(cropKey)
        await MarketPrice.findOneAndUpdate({ cropType: cropKey }, mockPrice, { upsert: true, new: true })
      }
    }

    console.log("[v0] Market prices updated successfully")
  } catch (error) {
    console.error("[v0] Error updating market prices:", error)
  }
}

const fetchRealMarketPrice = async (cropKey) => {
  try {
    if (!process.env.DATA_GOV_API_KEY) {
      console.warn("[v0] DATA_GOV_API_KEY not configured")
      return null
    }

    const commodityName = CROP_NAME_MAPPING[cropKey]
    if (!commodityName) {
      console.log(`[v0] No mapping found for crop: ${cropKey}`)
      return null
    }

    console.log(`[v0] Attempting to fetch price from data.gov.in for: ${commodityName}`)

    const response = await axios.get(DATA_GOV_API, {
      params: {
        "api-key": process.env.DATA_GOV_API_KEY,
        format: "json",
        limit: 100,
        "filters[commodity]": commodityName,
      },
      timeout: 10000,
    })

    console.log(`[v0] Data.gov.in API response status:`, response.status)

    if (!response.data || !response.data.records || response.data.records.length === 0) {
      console.log(`[v0] No records found for ${commodityName}`)
      return null
    }

    const records = response.data.records
    console.log(`[v0] Found ${records.length} records for ${commodityName}`)

    // Calculate average prices - API returns per quintal, convert to per kg
    const prices = records
      .filter((r) => r.modal_price && !isNaN(Number.parseFloat(r.modal_price)))
      .map((r) => Math.round(Number.parseFloat(r.modal_price) / 100)) // Convert quintal to kg

    if (prices.length === 0) {
      console.log(`[v0] No valid prices found for ${commodityName}`)
      return null
    }

    const currentPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const minPrice = Math.round(Math.min(...prices))
    const maxPrice = Math.round(Math.max(...prices))

    // Extract top markets
    const topMarkets = records
      .slice(0, 3)
      .filter((r) => r.market && r.modal_price)
      .map((r) => ({
        city: r.market,
        price: Math.round(Number.parseFloat(r.modal_price) / 100), // Convert to per kg
        demand: "medium",
      }))

    // Determine trend based on price variation
    const priceVariation = ((maxPrice - minPrice) / currentPrice) * 100
    let trend = "stable"
    if (priceVariation > 15) trend = "volatile"
    else if (currentPrice > (minPrice + maxPrice) / 2) trend = "up"
    else if (currentPrice < (minPrice + maxPrice) / 2) trend = "down"

    return {
      cropType: cropKey,
      price: {
        current: currentPrice,
        min30Days: minPrice,
        max30Days: maxPrice,
        average30Days: Math.round((minPrice + maxPrice) / 2),
      },
      demand: determineDemand(prices.length),
      supply: determineSupply(priceVariation),
      trend: trend,
      topMarkets: topMarkets.length > 0 ? topMarkets : getDefaultMarkets(currentPrice),
      forecastNextWeek: Math.round(currentPrice * (0.95 + Math.random() * 0.1)),
      forecastNextMonth: Math.round(currentPrice * (0.9 + Math.random() * 0.2)),
      lastUpdated: new Date(),
      source: "data.gov.in",
    }
  } catch (error) {
    console.error(`[v0] Error fetching real market price for ${cropKey}:`, error.message)
    return null
  }
}

const generateMockPrice = (cropKey) => {
  // Realistic base prices for Indian crops (per kg)
  const basePrices = {
    rice: 25,
    wheat: 22,
    maize: 18,
    cotton: 45,
    sugarcane: 3, // per kg (sold in bulk)
    potato: 15,
    tomato: 30,
    onion: 20,
    soybean: 35,
    groundnut: 48,
  }

  const basePrice = basePrices[cropKey] || 25
  const variation = (Math.random() - 0.5) * 10 // ±5 Rs variation
  const currentPrice = Math.max(10, Math.round(basePrice + variation)) // Minimum 10 Rs

  return {
    cropType: cropKey,
    price: {
      current: currentPrice,
      min30Days: Math.max(8, Math.round(currentPrice * 0.85)),
      max30Days: Math.round(currentPrice * 1.15),
      average30Days: Math.round(currentPrice * 0.95),
    },
    demand: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    supply: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
    topMarkets: getDefaultMarkets(currentPrice),
    forecastNextWeek: Math.max(8, Math.round(currentPrice * (0.9 + Math.random() * 0.2))),
    forecastNextMonth: Math.max(8, Math.round(currentPrice * (0.85 + Math.random() * 0.3))),
    lastUpdated: new Date(),
    source: "mock",
  }
}

const getDefaultMarkets = (basePrice) => {
  return [
    { city: "Delhi", price: basePrice + 10, demand: "high" },
    { city: "Mumbai", price: basePrice - 5, demand: "medium" },
    { city: "Bangalore", price: basePrice + 15, demand: "high" },
  ]
}

const determineDemand = (recordCount) => {
  if (recordCount > 50) return "high"
  if (recordCount > 20) return "medium"
  return "low"
}

const determineSupply = (priceVariation) => {
  if (priceVariation < 10) return "high"
  if (priceVariation < 20) return "medium"
  return "low"
}

export const getMarketTrends = async (cropType) => {
  try {
    const marketData = await MarketPrice.findOne({ cropType })
    if (!marketData) {
      return null
    }

    return {
      cropType,
      currentPrice: marketData.price.current,
      priceHistory: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), price: marketData.price.min30Days },
        { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), price: marketData.price.average30Days },
        { date: new Date(), price: marketData.price.current },
      ],
      demand: marketData.demand,
      supply: marketData.supply,
      trend: marketData.trend,
      bestSellingMarkets: marketData.topMarkets,
      source: marketData.source || "unknown",
    }
  } catch (error) {
    console.error("[v0] Error fetching market trends:", error)
    return null
  }
}
