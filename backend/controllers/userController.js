import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"

// Register a User
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    if (user) return next(new ErrorHandler("User already exists with this email"))
    user = await User.create({
        name, email, password,
        avatar: {
            public_id: "public_id",
            url: "url"
        }
    })

    sendToken(user, 201, res)
})

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorHandler("Enter email and password", 400))
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new ErrorHandler("User not found", 401))

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401))

    sendToken(user, 200, res)
})

// Logout user
export const logoutUser = catchAsyncError(async (req, res, next) => {

    res.status(200).cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Logged Out successfully"
    })
})

// Forgot Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new ErrorHandler("User not found", 404))
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is ${resetPasswordUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: `CuisineFusion password recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// Password Reset
export const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return next(new ErrorHandler("User not found", 404))

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)


})

// Get user details
export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user
    })
})

// Update password
export const updatepassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) return next(new ErrorHandler("Incorrect Password", 401))

    if (req.body.newPassword !== req.body.confirmPassword) return next(new ErrorHandler("Password doesn't match", 401))

    user.password = req.body.newPassword
    await user.save();

    sendToken(user, 200, res)
})

// Update profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
    }
    // TO Do Cloudinary
    await User.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    })
    res.status(200).json({
        success: true,
        message: "Profile updated"
    })
})

// Get users - A
export const getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        users
    })
})

// Get single user details - A
export const getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler(`User does not exist with Id ${req.params.id}`, 404))

    res.status(200).json({
        success: true,
        user
    })
})

// Modify user role - A
export const updateUserRole = catchAsyncError(async (req, res, next) => {

    // const newUserData = {
    //     name: req.body.name,
    //     email: req.body.email,
    //     role: req.body.role,
    // }

    await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
        new: true,
        runValidators: true,
        useFindAndmodify: false,
    })
    res.status(200).json({
        success: true,
        message: `User role updated to ${req.body.role}`
    })

})

//Delete a user - A
export const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))

    // Delete cloudinary for later

    await user.deleteOne()

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })

})