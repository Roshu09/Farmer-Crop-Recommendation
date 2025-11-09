import mongoose from "mongoose"

const systemLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["error", "info", "warning", "debug"],
      default: "info",
    },
    message: String,
    details: mongoose.Schema.Types.Mixed,
    userId: mongoose.Schema.Types.ObjectId,
    endpoint: String,
    statusCode: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("SystemLog", systemLogSchema)
