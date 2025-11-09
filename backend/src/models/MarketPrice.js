import mongoose from "mongoose"

const marketPriceSchema = new mongoose.Schema(
  {
    cropType: {
      type: String,
      required: true,
    },
    price: {
      current: Number,
      min30Days: Number,
      max30Days: Number,
      average30Days: Number,
    },
    demand: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    supply: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    trend: {
      type: String,
      enum: ["up", "down", "stable"],
      default: "stable",
    },
    topMarkets: [
      {
        city: String,
        price: Number,
        demand: String,
      },
    ],
    forecastNextWeek: Number,
    forecastNextMonth: Number,
    source: String,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("MarketPrice", marketPriceSchema)
