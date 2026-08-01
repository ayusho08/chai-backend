import dotenv from "dotenv";
dotenv.config({ path: "./.env" })

import connectDB from "./db/index.js";
import { app } from "./app.js";

const requiredEnvVars = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "CORS_ORIGIN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
]
const missingVars = requiredEnvVars.filter((v) => !process.env[v])
if (missingVars.length > 0) {
  console.error("Missing required env variables:", missingVars.join(", "))
  process.exit(1)
}

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`)
    })
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err)
  })
