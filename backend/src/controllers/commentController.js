const Comment = require('../models/Comment');
const Post = require('../models/Post'); 

// ===================================
// 1. CREATE COMMENT (C - Create)
// ===================================
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body; // Postman se 'text' aayega
    const userId = req.user.id; 

    // Validation
    if (!text) {
      return res.status(400).json({ success: false, error: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // Create Comment
    const comment = new Comment({
      post: postId,
      author: userId,     
      content: text       // Input 'text' -> DB 'content'
    });

    await comment.save();

    // Post count update
    post.commentsCount += 1;
    await post.save();

    // Populate author details
    await comment.populate("author", "name avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment
    });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ===================================
// 2. GET COMMENTS BY POST (R - Read)
// ===================================
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate('author', 'name avatar photoURL username') // 'photoURL' ko 'avatar' kar diya
            .sort({ createdAt: -1 }); // Naya comment sabse upar

        res.status(200).json({
            success: true,
            count: comments.length,
            comments
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, error: "Server error while fetching comments" });
    }
};

// ===================================
// 3. UPDATE COMMENT (U - Update)
// ===================================
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body; // Yahan bhi 'text' hi accept karenge consistency ke liye
        const currentUserId = req.user.id;

        if (!text) {
            return res.status(400).json({ success: false, error: "Updated text is required" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        // Authorization Check
        if (comment.author.toString() !== currentUserId.toString()) {
            return res.status(403).json({ success: false, error: "You are not authorized to update this comment" });
        }

        // Update logic
        comment.content = text; // DB field 'content' update hoga
        await comment.save();

        // Updated data wapas bhejo
        await comment.populate('author', 'name avatar username');

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });

    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ success: false, error: "Server error while updating comment" });
    }
};

// ===================================
// 4. DELETE COMMENT (D - Delete)
// ===================================
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const currentUserId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        // Authorization Check
        if (comment.author.toString() !== currentUserId.toString()) {
            return res.status(403).json({ success: false, error: "You are not authorized to delete this comment" });
        }

        // 1. Post se commentsCount kam karein
        await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

        // 2. Comment delete karein
        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ success: false, error: "Server error while deleting comment" });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment, 
    deleteComment
};