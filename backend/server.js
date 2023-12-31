import app from "./app.js";
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js";
import cloudinary from "cloudinary"
import Razorpay from "razorpay"

dotenv.config({
    path: "backend/config/config.env"
})

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})

connectDb();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})