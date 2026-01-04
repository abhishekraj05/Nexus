const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hashed password yahan store hoga
  otp: { type: String, required: true },
  
  // 👇 Ye magic hai: 10 minute (600 seconds) baad ye data apne aap delete ho jayega
  createdAt: { type: Date, default: Date.now, expires: 600 } 
});

module.exports = mongoose.model("TempUser", tempUserSchema);