import mongoose from "mongoose"

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      state: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    size: {
      type: Number,
      required: true, // in acres
    },
    soilData: {
      ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      soilType: String,
    },
    crops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FarmCrop",
      },
    ],
    weather: {
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      windSpeed: Number,
      lastUpdated: Date,
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

export default mongoose.model("Farm", farmSchema)
