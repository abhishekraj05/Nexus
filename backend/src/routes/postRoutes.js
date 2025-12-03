const express = require("express");
const router = express.Router();

const {
  createPost,
  getSinglePost,
  getFriendFeed,
  getMyPosts,
  toggleLike,
  deletePost,
  updatePost
} = require("../controllers/postController");

// const  getFeedPost  = require("../controllers/postControllerFeed"); 

const { upload } = require("../config/postCloudinary");  // ⬅️ Cloudinary upload middleware
const { authMiddleware } = require("../middleware/authMiddleware");

// 🟢 Create a post (image/video/document)
router.post("/", authMiddleware, upload.single("file"), createPost);

// 🟡 Friend feed
router.get("/feed", authMiddleware, getFriendFeed);

// 🔵 Single post
router.get("/:id", authMiddleware, getSinglePost);

// 🟣 My posts
router.get("/user/me", authMiddleware, getMyPosts);

// ❤️ Like / Unlike
router.post("/:id/like", authMiddleware, toggleLike);

// ❌ Delete post
router.delete("/:id", authMiddleware, deletePost);

// ✏️ Update post (caption/media)
router.put("/:id", authMiddleware, upload.single("file"), updatePost);

module.exports = router;
