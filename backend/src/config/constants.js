// Crop types and properties
export const CROPS = {
  RICE: {
    name: "Rice",
    soilPHRange: { min: 5.5, max: 7.0 },
    moistureRange: { min: 40, max: 70 },
    temperatureRange: { min: 20, max: 35 },
    rainfall: 1000,
    duration: 120,
    baseYield: 50,
  },
  WHEAT: {
    name: "Wheat",
    soilPHRange: { min: 6.5, max: 7.5 },
    moistureRange: { min: 25, max: 50 },
    temperatureRange: { min: 15, max: 30 },
    rainfall: 400,
    duration: 140,
    baseYield: 45,
  },
  CORN: {
    name: "Corn",
    soilPHRange: { min: 6.0, max: 7.0 },
    moistureRange: { min: 40, max: 75 },
    temperatureRange: { min: 18, max: 32 },
    rainfall: 600,
    duration: 120,
    baseYield: 70,
  },
  COTTON: {
    name: "Cotton",
    soilPHRange: { min: 6.0, max: 7.5 },
    moistureRange: { min: 35, max: 65 },
    temperatureRange: { min: 21, max: 32 },
    rainfall: 500,
    duration: 180,
    baseYield: 25,
  },
  POTATO: {
    name: "Potato",
    soilPHRange: { min: 5.5, max: 7.0 },
    moistureRange: { min: 50, max: 75 },
    temperatureRange: { min: 15, max: 25 },
    rainfall: 500,
    duration: 90,
    baseYield: 200,
  },
  TOMATO: {
    name: "Tomato",
    soilPHRange: { min: 6.0, max: 7.5 },
    moistureRange: { min: 60, max: 80 },
    temperatureRange: { min: 20, max: 28 },
    rainfall: 400,
    duration: 80,
    baseYield: 30,
  },
}

// NPK ranges for soil classification
export const SOIL_NPK = {
  NITROGEN: { low: 40, medium: 100, high: 200 },
  PHOSPHORUS: { low: 15, medium: 40, high: 80 },
  POTASSIUM: { low: 100, medium: 300, high: 600 },
}

// Market demand levels
export const MARKET_DEMAND = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
}

// Recommendation confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
}
