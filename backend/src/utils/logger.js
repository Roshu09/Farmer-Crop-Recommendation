import SystemLog from "../models/SystemLog.js"

export const logAction = async (type, message, details = {}, userId = null, endpoint = null) => {
  try {
    await SystemLog.create({
      type,
      message,
      details,
      userId,
      endpoint,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Logging error:", error)
  }
}

export const logError = (error, endpoint = null) => {
  console.error("Error:", error)
  logAction("error", error.message, { stack: error.stack }, null, endpoint)
}
