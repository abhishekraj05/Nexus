const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const { authMiddleware } = require("../middleware/authMiddleware");

// Controller Import karo (updateReel aur deleteReel add kar lena)
const { 
  createReel, 
  getAllReels, 
  getMyReels, 
  updateReel, 
  deleteReel,  
  toggleLike
} = require("../controllers/reelController");

// --- Routes ---

router.post("/create", authMiddleware, upload.single("video"), createReel);
router.get("/feed", authMiddleware, getAllReels);
router.get("/my-reels", authMiddleware, getMyReels);

// 👇 New Update & Delete Routes
router.put("/:id", authMiddleware, updateReel);   // Caption/Visibility update ke liye
router.delete("/:id", authMiddleware, deleteReel); // Delete ke liye

router.put("/:id/like", authMiddleware, toggleLike);

module.exports = router;