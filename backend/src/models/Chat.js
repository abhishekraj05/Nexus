// const mongoose = require("mongoose");
// const ChatSchema = new mongoose.Schema({
//   type: { type: String, enum: ["direct","group"], default:"direct" },
//   name: String,
//   members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   lastMessage: { text: String, senderId: mongoose.Schema.Types.ObjectId, timestamp: Date },
//   unreadCounts: { type: Map, of: Number }
// });
// module.exports = mongoose.model("Chat", ChatSchema);

const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    type: { type: String, enum: ["direct", "group"], default: "direct" },
    name: String, // Only used for group chats
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Only used for group chats
    lastMessage: {
        text: String,
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference sender
        timestamp: Date
    },
    unreadCounts: { type: Map, of: Number, default: {} }, // Default empty map

    // --- ADDED FOR MUTE/ARCHIVE ---
    isMutedBy: [{ // Users who have muted this chat
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    archivedBy: [{ // Users who have archived this chat
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // ------------------------------------

}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Chat", ChatSchema);
