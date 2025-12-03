const express = require("express");
const router = express.Router();
const {
  createDirectChat,
  createGroupChat,
  addMember,
  removeMember,
  getChats,
  deleteChat,
  muteChat,
  archiveChat,
  unarchiveChat,
  getArchivedChats
} = require("../controllers/chatController");

const { authMiddleware } = require("../middleware/authMiddleware");

// 1-to-1 chat
router.post("/direct", authMiddleware, createDirectChat);

// Group chat
router.post("/group", authMiddleware, createGroupChat);

// Add member to group
router.post("/group/add-member", authMiddleware, addMember);

// Remove member from group
router.post("/group/remove-member", authMiddleware, removeMember);

// delete chat
router.delete("/:chatId", authMiddleware, deleteChat);

// Mute/Unmute a chat
router.put("/mute/:chatId", authMiddleware, muteChat); // <-- Mute Route

// Archive a chat
router.put("/archive/:chatId", authMiddleware, archiveChat); // <-- Archive Route

// Unarchive a chat
router.put("/unarchive/:chatId", authMiddleware, unarchiveChat);

// --- NEW ROUTE for getting archived chats ---
router.get("/archived", authMiddleware, getArchivedChats);

// Get all chats of user
router.get("/", authMiddleware, getChats);

// **Export router object**
module.exports = router;
