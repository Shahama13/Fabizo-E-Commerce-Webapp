import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getResetPasswordToken = function () {
    
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken;
}

const User = mongoose.model("User", userSchema)

export default User;