import mongoose from "mongoose"
import ENV from "./env.js"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGOO_URI)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
        process.exit(1)
    }
}

export default connectDB