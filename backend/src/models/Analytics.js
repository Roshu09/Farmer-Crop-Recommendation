import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    monthYear: String, // Format: YYYY-MM
    metrics: {
      totalHarvest: Number,
      totalYield: Number,
      averageYield: Number,
      totalExpenses: Number,
      totalRevenue: Number,
      profit: Number,
      profitMargin: Number,
      soilHealth: Number,
      waterUsage: Number,
      cropsGrown: Number,
    },
    cropBreakdown: [
      {
        cropType: String,
        area: Number,
        yield: Number,
        revenue: Number,
        profit: Number,
      },
    ],
    weatherImpact: {
      rainfall: Number,
      temperature: Number,
      humidity: Number,
      impactScore: Number,
    },
    recommendations: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Analytics", analyticsSchema)
