import mongoose from "mongoose"

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    soilPHRange: {
      min: Number,
      max: Number,
    },
    moistureRange: {
      min: Number,
      max: Number,
    },
    temperatureRange: {
      min: Number,
      max: Number,
    },
    rainfall: Number,
    duration: Number, // in days
    season: [String], // e.g., ['summer', 'monsoon']
    baseYield: Number, // kg per acre
    price: Number, // current market price
    demand: String, // high, medium, low
    nutrients: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
    },
    bestPractices: [String],
    commonPests: [String],
    diseases: [String],
    irrigation: {
      frequency: String,
      amount: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Crop", cropSchema)
