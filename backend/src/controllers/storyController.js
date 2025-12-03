const Story = require("../models/Story");
const Friendship = require("../models/FriendRequest"); 
const User = require("../models/User");

// Helper function 
const getStoryType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "image";
};

// -------------------------------------------------------
// 1. CREATE STORY
// -------------------------------------------------------
exports.createStory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, error: "File required for status" });
    }

    const story = new Story({
      user: userId,
      mediaUrl: req.file.path, 
      type: getStoryType(req.file.mimetype)
    });

    await story.save();

    res.status(201).json({
      success: true,
      message: "Status added successfully",
      story
    });

  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// -------------------------------------------------------
// 2. GET STORIES FEED
// -------------------------------------------------------
exports.getStoriesFeed = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const friendships = await Friendship.find({
        status: "accepted",
        $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
        ]
    });

    const friendIds = friendships.map(f => {
        return f.sender.toString() === currentUserId.toString()
            ? f.receiver
            : f.sender;
    });

    const allowedUsers = [...friendIds, currentUserId];

    const stories = await Story.find({
        user: { $in: allowedUsers }
    })
    .populate("user", "name avatar photoURL") 
    .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });

  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// -------------------------------------------------------
// 3. DELETE STORY (Added)
// -------------------------------------------------------
exports.deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user.id;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ success: false, error: "Story not found" });
        }

        // Check: Kya delete karne wala wahi hai jisne story dali thi?
        if (story.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: "Not authorized to delete this story" });
        }

        await story.deleteOne();

        res.status(200).json({
            success: true,
            message: "Story deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// -------------------------------------------------------
// 4. UPDATE STORY (Added - Only Media can be changed)
// -------------------------------------------------------
// Note: Stories usually edit nahi hoti, replace hoti hain. 
// Par agar user file change karna chahe to ye logic hai:
exports.updateStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user.id;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ success: false, error: "Story not found" });
        }

        // Authorization Check
        if (story.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: "Not authorized to update this story" });
        }

        // Agar nayi file aayi hai to update karo
        if (req.file) {
            story.mediaUrl = req.file.path;
            story.type = getStoryType(req.file.mimetype);
            
            // Optional: CreatedAt update kar sakte ho taaki 24 hours firse start ho jaye
            // story.createdAt = Date.now(); 
            
            await story.save();

            res.status(200).json({
                success: true,
                message: "Story updated successfully",
                story
            });
        } else {
            return res.status(400).json({ success: false, error: "No new file provided for update" });
        }

    } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};