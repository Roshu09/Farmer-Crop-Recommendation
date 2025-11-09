import mongoose from "mongoose"

const farmCropSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    plantedDate: Date,
    expectedHarvestDate: Date,
    area: {
      type: Number,
      required: true, // in acres
    },
    status: {
      type: String,
      enum: ["planning", "planted", "growing", "ready_to_harvest", "harvested"],
      default: "planning",
    },
    yield: {
      expected: Number,
      actual: Number,
    },
    expenses: {
      seeds: Number,
      fertilizer: Number,
      pesticides: Number,
      labor: Number,
      total: Number,
    },
    revenue: Number,
    profit: Number,
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

export default mongoose.model("FarmCrop", farmCropSchema)
