import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },
    phone: String,
    location: {
      state: String,
      district: String, // Added district field to match frontend
      city: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    farm: {
      name: String,
      size: Number, // in acres
      soilType: String,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
    },
    profileComplete: {
      type: Boolean,
      default: false,
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)
