import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB connected:", connection.connection.host)
    return connection
  } catch (error) {
    console.error("Database connection error:", error.message)
    process.exit(1)
  }
}

export default connectDB
