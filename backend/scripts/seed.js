import mongoose from "mongoose"
import dotenv from "dotenv"
import Crop from "../src/models/Crop.js"
import MarketPrice from "../src/models/MarketPrice.js"
import { CROPS } from "../src/config/constants.js"

dotenv.config()

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await Crop.deleteMany({})
    await MarketPrice.deleteMany({})

    // Seed crops
    for (const [key, data] of Object.entries(CROPS)) {
      const crop = new Crop({
        name: data.name,
        soilPHRange: data.soilPHRange,
        moistureRange: data.moistureRange,
        temperatureRange: data.temperatureRange,
        rainfall: data.rainfall,
        duration: data.duration,
        baseYield: data.baseYield,
        demand: "medium",
      })
      await crop.save()
    }

    // Seed market prices
    for (const [key, data] of Object.entries(CROPS)) {
      const price = new MarketPrice({
        cropType: key,
        price: {
          current: 100 + Math.random() * 200,
          min30Days: 80 + Math.random() * 50,
          max30Days: 150 + Math.random() * 100,
          average30Days: 100 + Math.random() * 100,
        },
        demand: "medium",
        supply: "medium",
        trend: "stable",
      })
      await price.save()
    }

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedDatabase()
