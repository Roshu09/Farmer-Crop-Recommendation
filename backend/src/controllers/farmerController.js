import Farm from "../models/Farm.js"
import FarmCrop from "../models/FarmCrop.js"
import User from "../models/User.js" // Import User model

export const createFarm = async (req, res, next) => {
  try {
    console.log("[v0] Create farm request body:", req.body)
    console.log("[v0] User ID:", req.user.id)

    const { name, city, state, latitude, longitude, size, soilType, soilData } = req.body

    if (!name || !size) {
      return res.status(400).json({ error: "Farm name and size are required" })
    }

    const user = await User.findById(req.user.id)
    console.log("[v0] User found:", user?.email)

    const farm = new Farm({
      userId: req.user.id,
      name,
      location: {
        city: city || user.location?.district,
        state: state || user.location?.state,
        coordinates: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
      },
      size,
      soilData: soilData
        ? {
            nitrogen: soilData.nitrogen,
            phosphorus: soilData.phosphorus,
            potassium: soilData.potassium,
            pH: soilData.pH,
            soilType: soilType || soilData.soilType,
          }
        : { soilType },
    })

    await farm.save()
    console.log("[v0] Farm saved successfully:", farm._id)

    // Update user's farmId
    await User.findByIdAndUpdate(req.user.id, { farmId: farm._id })

    res.status(201).json({ message: "Farm created successfully", farm })
  } catch (error) {
    console.error("[v0] Create farm error:", error)
    next(error)
  }
}

export const getFarmData = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id }).populate("crops")

    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    res.json({ farm })
  } catch (error) {
    next(error)
  }
}

export const updateFarmSoilData = async (req, res, next) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, soilType } = req.body

    const farm = await Farm.findOneAndUpdate(
      { userId: req.user.id },
      {
        soilData: { ph, nitrogen, phosphorus, potassium, soilType },
      },
      { new: true },
    )

    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    res.json({ message: "Soil data updated", farm })
  } catch (error) {
    next(error)
  }
}

export const addCropToFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })

    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const { cropType, area, plantedDate, expectedHarvestDate } = req.body

    const farmCrop = new FarmCrop({
      farmId: farm._id,
      cropType,
      area,
      plantedDate,
      expectedHarvestDate,
      status: "planning",
    })

    await farmCrop.save()
    farm.crops.push(farmCrop._id)
    await farm.save()

    res.status(201).json({ message: "Crop added to farm", farmCrop })
  } catch (error) {
    next(error)
  }
}

export const getFarmCrops = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ userId: req.user.id })

    if (!farm) {
      return res.status(404).json({ error: "Farm not found" })
    }

    const crops = await FarmCrop.find({ farmId: farm._id })
    res.json({ crops })
  } catch (error) {
    next(error)
  }
}

export const updateCropStatus = async (req, res, next) => {
  try {
    const { cropId } = req.params
    const { status, yieldActual, revenue, expenses } = req.body

    const farmCrop = await FarmCrop.findByIdAndUpdate(
      cropId,
      {
        status,
        "yield.actual": yieldActual,
        revenue,
        "expenses.total": expenses,
        profit: (revenue || 0) - (expenses || 0),
      },
      { new: true },
    )

    if (!farmCrop) {
      return res.status(404).json({ error: "Crop not found" })
    }

    res.json({ message: "Crop status updated", farmCrop })
  } catch (error) {
    next(error)
  }
}

export const getDashboardData = async (req, res, next) => {
  try {
    console.log("[v0] Dashboard request - User ID:", req.user.id)

    const farm = await Farm.findOne({ userId: req.user.id })
    console.log("[v0] Farm found:", farm ? "Yes" : "No")

    const crops = farm ? await FarmCrop.find({ farmId: farm._id }) : []
    const totalCrops = crops.length
    const activeCrops = crops.filter((c) => c.status !== "harvested").length
    const harvestedCrops = crops.filter((c) => c.status === "harvested").length

    const weather = farm?.weather || {
      temperature: 25,
      humidity: 65,
      windSpeed: 10,
      condition: "Clear",
      rainfall: 0,
    }

    const soilData = farm?.soilData
      ? {
          nitrogen: farm.soilData.nitrogen || 150,
          phosphorus: farm.soilData.phosphorus || 60,
          potassium: farm.soilData.potassium || 200,
          pH: farm.soilData.pH || 7,
        }
      : {
          nitrogen: 150,
          phosphorus: 60,
          potassium: 200,
          pH: 7,
        }

    console.log("[v0] Soil data being sent:", soilData)

    const response = {
      dashboard: {
        farmName: farm?.name || "My Farm",
        farmSize: farm?.size || "Not set",
        totalCrops,
        activeCrops,
        harvestedCrops,
        weather,
        soilData,
        recentCrops: crops.slice(-3),
        hasFarm: !!farm,
      },
    }

    console.log("[v0] Sending dashboard response")
    res.json(response)
  } catch (error) {
    console.error("[v0] Dashboard error:", error)
    next(error)
  }
}
