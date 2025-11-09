import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location } = req.body

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Create new user
    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password,
      location: {
        state: location?.state || "",
        district: location?.district || "",
      },
      role: "farmer",
    })

    await user.save()

    const token = generateToken(user._id)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.log("[v0] Signup error:", error.message)
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("farmId")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, state, country, farmName, farmSize } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        location: { city, state, country },
        farm: { name: farmName, size: farmSize },
        profileComplete: true,
      },
      { new: true },
    )

    res.json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}
