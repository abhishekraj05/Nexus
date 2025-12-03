// const mongoose = require("mongoose");
// const MessageSchema = new mongoose.Schema({
//   chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   type: { type: String, enum: ["text","image","video","audio","file","location"], default:"text" },
//   text: String,
//   mediaUrl: String,
//   createdAt: { type: Date, default: Date.now },
//   edited: { type: Boolean, default:false },
//   deleted: { type: Boolean, default:false },
//   reactions: { type: Map, of: String },
//   replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
//   deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   seenBy: { type: Map, of: Date },
//   pinned: { type: Boolean, default:false },
//   starred: { type: Boolean, default:false },
// });
// module.exports = mongoose.model("Message", MessageSchema);



const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["text", "image", "video", "audio", "file", "location"],
        default: "text"
    },
    text: { type: String, trim: true }, // Encrypted for type 'text'
    mediaUrl: String,
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }, // For soft delete
    reactions: { type: Map, of: String, default: {} }, // userId -> emoji
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who received it
    seenBy: { type: Map, of: Date, default: {} }, // userId -> seenDate
    pinned: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    clearedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Status for client-side tick display
    status: {
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster querying of messages within a chat
MessageSchema.index({ chatId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);