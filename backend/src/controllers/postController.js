const mongoose = require("mongoose"); 
const Post = require("../models/Post");
const Friendship = require("../models/FriendRequest");
const { cloudinary } = require("../config/cloudinary"); 



// Helper function (Controller ke upar hi rehne do)
const getPostType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image"; // Lowercase return karo (Model enum match karne ke liye)
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "file";
};

// -------------------------------------------------------
// CREATE POST (FIXED VERSION)
// -------------------------------------------------------
exports.createPost = async (req, res) => {
    try {
        // 1. Console log lagao taaki pata chale data aa raha hai ya nahi
        console.log("Logged-in user:", req.user);
        console.log("Req Body:", req.body);
        console.log("Req File:", req.file); // File check karna zaroori hai

        // 2. User Check
        if (!req.user) {
            return res.status(401).json({ success: false, error: "User not found in request (Auth Error)" });
        }

        // 3. File Check
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Please upload a file (Image/Video)" });
        }

        // 4. Create Post Object
        // Note: mongoose.Types.ObjectId() ki zaroorat nahi hoti, 
        // Mongoose automatically string ID ko convert kar leta hai.
        const post = new Post({
            author: req.user.id, // Auth middleware se _id milta hai usually
            caption: req.body.caption || "",
            mediaUrl: req.file.path, // Cloudinary ka URL
            type: getPostType(req.file.mimetype)
        });

        // 5. Save to DB
        await post.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message // Frontend pe error message dikhega
        });
    }
};



exports.getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("author", "name avatar photoURL");

        if (!post) return res.status(404).json({ success: false, error: "Post not found" });

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};


// -------------------------------------------------------
// GET FRIENDS + OWN POSTS FEED
// -------------------------------------------------------
exports.getFriendFeed = async (req, res) => {
    try {
        const userId = req.user.id;

        // Step 1: Find all accepted friendships of current user
        const friendships = await Friendship.find({
            status: "accepted",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        });

        // Step 2: Extract friend IDs
        const friendIds = friendships.map(f => {
            return f.sender.toString() === userId.toString()
                ? f.receiver
                : f.sender;
        });

        // Step 3: Allowed authors = friends + yourself
        const allowedAuthors = [...friendIds, userId];

        // Step 4: Fetch posts
        const posts = await Post.find({
            author: { $in: allowedAuthors }
        })
            .populate("author", "name avatar photoURL")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            postsCount: posts.length,
            posts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// -------------------------------------------------------
// GET ALL POSTS OF LOGGED-IN USER
// -------------------------------------------------------
exports.getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .populate("author", "name photoURL avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// -------------------------------------------------------
// LIKE / UNLIKE A POST
// -------------------------------------------------------
exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        const liked = post.likes.includes(userId);

        if (liked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            success: true,
            liked: !liked,
            likesCount: post.likes.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// -------------------------------------------------------
// DELETE POST (Only Author)
// -------------------------------------------------------
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to delete this post"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// -------------------------------------------------------
// UPDATE POST (Only Author)
// -------------------------------------------------------



exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { caption } = req.body;

        // 1. Post Dhundo
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        // 2. Authorization Check
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to update this post"
            });
        }

        // 3. Caption Update
        post.caption = caption || post.caption;

        // ✅ 4. NEW MEDIA UPDATE LOGIC (Ye missing tha)
        // Agar request me nayi file aayi hai, toh URL aur Type update karo
        if (req.file) {
            console.log("New file detected:", req.file.path); // Debugging
            post.mediaUrl = req.file.path; // Cloudinary URL
            post.type = getPostType(req.file.mimetype); // Type (image/video) update
        }

        post.updatedAt = Date.now();

        // 5. Save
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
