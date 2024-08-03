const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    otp: String, // Field to store the OTP for email verification
    otpExpires: Date, // Field to store the expiry time for the OTP
    isVerified: { type: Boolean, default: false }, // Field to store verification status
    resetPasswordOTP: String, // Field to store the OTP for password reset
    resetPasswordExpires: Date, // Field to store the expiry time for the OTP
});

const User = mongoose.model('UserInfo', UserSchema);

module.exports = User;
