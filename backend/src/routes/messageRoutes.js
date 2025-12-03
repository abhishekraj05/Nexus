const express = require("express");
const router = express.Router();
const {
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    reactMessage,
    markDelivered,
    markSeen,
    markChatAsSeen,
    deleteMultipleMessages,
    clearChat,
    deleteMultipleForMe,
    deleteMultipleForEveryone
} = require("../controllers/messageController");

// Assuming authMiddleware.js exports the function directly
const { authMiddleware } = require("../middleware/authMiddleware");

// --- Message Routes ---

// Send a new message to a chat
router.post("/", authMiddleware, sendMessage);

// Get all messages for a specific chat
router.get("/:chatId", authMiddleware, getMessages);

// --- Routes targeting a SPECIFIC message ---

// Edit a specific message
router.put("/:messageId", authMiddleware, editMessage); // Changed route

// Delete a specific message (already correct)
router.delete("/:messageId", authMiddleware, deleteMessage);

// Add/update a reaction to a specific message
router.post("/:messageId/react", authMiddleware, reactMessage); // Changed route

// Mark a specific message as delivered for the logged-in user
router.post("/:messageId/delivered", authMiddleware, markDelivered); // Changed route

// Mark a specific message as seen by the logged-in user
router.post("/:messageId/seen", authMiddleware, markSeen); // Changed route

// Poori chat ko 'seen' mark karna
router.post("/:chatId/mark-seen", authMiddleware, markChatAsSeen);

// DELETE /api/message/clear/:chatId
router.delete("/clear/:chatId", authMiddleware, clearChat);

// Multiple selected messages ko delete karna
// POST /api/message/delete-multiple
router.post("/delete-multiple", authMiddleware, deleteMultipleMessages);

// 1. "Delete for Me" (Selected messages ko clear karega)
router.post("/delete-multiple-for-me", authMiddleware, deleteMultipleForMe);

// 2. "Delete for Everyone" (Selected messages ko soft delete karega)
router.post("/delete-multiple-for-everyone", authMiddleware, deleteMultipleForEveryone);

module.exports = router;