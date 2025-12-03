const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // ✨ MAGIC LINE: 86400 seconds = 24 Hours
    // Iske baad MongoDB apne aap is document ko delete kar dega
  }
});

module.exports = mongoose.model("Story", StorySchema);