// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();

const {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

const { authMiddleware } = require("../middleware/authMiddleware");

// ----------------------------
// CREATE COMMENT
// POST /api/comments/:postId
// ----------------------------
router.post("/:postId", authMiddleware, createComment);

// ----------------------------
// GET COMMENTS BY POST
// GET /api/comments/:postId
// ----------------------------
router.get("/:postId", authMiddleware, getCommentsByPost);

// ----------------------------
// UPDATE COMMENT
// PUT /api/comments/:commentId
// ----------------------------
router.put("/:commentId", authMiddleware, updateComment);

// ----------------------------
// DELETE COMMENT
// DELETE /api/comments/:commentId
// ----------------------------
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
