// models/FriendRequest.js
const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema(
  {
    // Request kisne bheji
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Request kisko bheji
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Request ka status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Pata chalega request kab bheji/accept hui
  }
);

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);