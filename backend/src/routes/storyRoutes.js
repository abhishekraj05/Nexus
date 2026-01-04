const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../config/postCloudinary");
const { 
    createStory, 
    getStoriesFeed, 
    deleteStory, // Import kiya
    updateStory,  // Import kiya
    viewStory
} = require("../controllers/storyController");

// 1. Upload Status
router.post("/", authMiddleware, upload.single("file"), createStory);

// 2. Get Feed
router.get("/feed", authMiddleware, getStoriesFeed);

// 3. Delete Status (👇 NEW)
router.delete("/:storyId", authMiddleware, deleteStory);

// 4. Update Status (👇 NEW - File required)
router.put("/:storyId", authMiddleware, upload.single("file"), updateStory);

router.put("/:storyId/view", authMiddleware, viewStory);

module.exports = router;