// const Post = require('../models/Post'); 
// const Friendship = require("../models/FriendRequest"); 

// // Note: formatPostDetails is used here. For simplicity, assume it's imported or defined locally.
// const formatPostDetails = (post, currentUserId) => {
//     // Check karein ki current user ne like kiya hai ya nahi
//     const isLiked = post.likes.some(likeId => likeId.toString() === currentUserId.toString());

//     return {
//         _id: post._id,
//         caption: post.caption,
//         mediaUrl: post.mediaUrl,
//         type: post.type,
//         createdAt: post.createdAt,
//         updatedAt: post.updatedAt,
//         author: post.author, // Populated field
//         likesCount: post.likes ? post.likes.length : 0,
//         commentsCount: post.commentsCount || 0,
//         sharesCount: post.sharesCount || 0,
//         isLiked: isLiked 
//     };
// };

// // ===================================
// // GET FEED POSTS (Read Feed)
// // GET /api/posts/feed
// // ===================================
// const getFeedPosts = async (req, res) => {
//     const currentUserId = req.user._id;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     try {
//         // 1. Friends ki IDs nikaalein
//         const friendships = await Friendship.find({
//             $or: [
//                 { userA: currentUserId, status: 'accepted' },
//                 { userB: currentUserId, status: 'accepted' }
//             ]
//         }).lean(); 

//         // 2. Friends aur Current User ki IDs ka array banayein
//         const friendIds = friendships.map(friendship => {
//             if (friendship.userA.toString() === currentUserId.toString()) {
//                 return friendship.userB;
//             }
//             return friendship.userA;
//         });
//         friendIds.push(currentUserId);
        
//         // 3. Posts ko fetch karein
//         const posts = await Post.find({
//             author: { $in: friendIds }
//         })
//         .populate('author', 'name photoURL') 
//         .sort({ createdAt: -1 }) 
//         .skip(skip) 
//         .limit(limit); 

//         // 4. Posts ko format karein
//         const formattedPosts = posts.map(post => formatPostDetails(post, currentUserId));

//         const totalPosts = await Post.countDocuments({ author: { $in: friendIds } });

//         return res.status(200).json({
//             status: 'success',
//             results: formattedPosts.length,
//             total: totalPosts,
//             page: page,
//             data: formattedPosts
//         });

//     } catch (error) {
//         console.error("Error in getFeedPosts:", error);
//         return res.status(500).json({ message: "Feed posts fetch karte samay server error." });
//     }
// };

// module.exports =  getFeedPosts ;











const Post = require("../models/Post");
const Friendship = require("../models/FriendRequest");

// Format helper
const formatPostDetails = (post, currentUserId) => {
    const isLiked = post.likes.some(
        (likeId) => likeId.toString() === currentUserId.toString()
    );

    return {
        _id: post._id,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        type: post.type,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        likesCount: post.likes.length,
        isLiked,
    };
};

// ===================================
// GET FEED POSTS 
// /api/posts/feed?page=1&limit=10
// ===================================
const getFeedPosts = async (req, res) => {
    const currentUserId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        // 1. Tumhare FriendRequest schema ke hisab se dhoondo:
        const friendships = await Friendship.find({
            status: "accepted",
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        });

        // 2. Friend IDs nikaalo:
        const friendIds = friendships.map((fr) => {
            return fr.sender.toString() === currentUserId.toString()
                ? fr.receiver
                : fr.sender;
        });

        // 3. Allowed user list: me + friends
        const allowedUsers = [...friendIds, currentUserId];

        // 4. Posts fetch
        const posts = await Post.find({
            author: { $in: allowedUsers }
        })
            .populate("author", "name avatar photoURL")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedPosts = posts.map((post) => 
            formatPostDetails(post, currentUserId)
        );

        const totalPosts = await Post.countDocuments({
            author: { $in: allowedUsers }
        });

        return res.status(200).json({
            success: true,
            count: formattedPosts.length,
            total: totalPosts,
            page,
            data: formattedPosts,
        });

    } catch (error) {
        console.error("Error in getFeedPosts:", error);
        return res.status(500).json({
            success: false,
            error: "Server error while fetching feed."
        });
    }
};


module.exports =  getFeedPosts ;