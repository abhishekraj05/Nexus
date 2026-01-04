// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    photoURL: {
      type: String,
      default: "https://api.dicebear.com/7.x/initials/svg?seed=DefaultUser",
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Bio 200 characters se zyada nahi ho sakta"],
    },
    
    isVerified: {
      type: Boolean,
      default: false, // Shuru mein false rahega
    },
    otp: {
      type: String, // OTP store karne ke liye
    },
    otpExpires: {
      type: Date, // OTP kab expire hoga
    },
    // ------------------------------------
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    
    // --- SIRF YEH RAKHEIN ---
    // Yeh un logo ki list hai jo aapke dost ban chuke hain
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // -----------------------

    fcmTokens: {
      type: [String],
      default: [],
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);