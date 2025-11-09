export const CROPS = ["Rice", "Wheat", "Corn", "Cotton", "Sugarcane", "Pulses", "Oilseeds", "Vegetables", "Fruits"]

export const SOIL_NUTRIENTS = {
  NITROGEN: { min: 50, optimal: 100, max: 200, unit: "mg/kg" },
  PHOSPHORUS: { min: 20, optimal: 50, max: 150, unit: "mg/kg" },
  POTASSIUM: { min: 100, optimal: 150, max: 300, unit: "mg/kg" },
}

export const SOIL_PH_RANGE = {
  min: 6.0,
  optimal: 7.0,
  max: 7.5,
}

export const WEATHER_CONDITIONS = ["Clear", "Cloudy", "Rainy", "Stormy", "Foggy", "Partly Cloudy"]

export const API_TIMEOUTS = {
  SHORT: 5000, // 5 seconds
  MEDIUM: 15000, // 15 seconds
  LONG: 30000, // 30 seconds
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
}
