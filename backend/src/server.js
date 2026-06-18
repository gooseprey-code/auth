import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


import ENV from "./lib/env.js"
import authRoutes from "./routes/auth.routes.js"
import connectDB from "./lib/connectDB.js"


const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth", authRoutes)

const startServer = () => {
    app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`)
    })
    connectDB ()
}

startServer()