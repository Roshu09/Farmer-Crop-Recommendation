import mongoose from "mongoose"

const recommendationSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendations: [
      {
        cropType: String,
        suitabilityScore: Number,
        confidence: Number,
        reasoning: String,
        factors: {
          soil: Number,
          weather: Number,
          season: Number,
          market: Number,
        },
        benefits: [String],
        risks: [String],
        estimatedYield: Number,
        marketPrice: Number,
        suggestedPlantingDate: Date,
      },
    ],
    weatherData: {
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      season: String,
    },
    soilData: {
      ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
    },
    generatedAt: {
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

export default mongoose.model("Recommendation", recommendationSchema)
