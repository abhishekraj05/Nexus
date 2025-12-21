const Reel = require("../models/Reel");
const Friendship = require("../models/FriendRequest");
const { cloudinary } = require("../config/cloudinary");

// -------------------------------------------------------
// 1. CREATE REEL (With Visibility)
// -------------------------------------------------------
exports.createReel = async (req, res) => {
  try {
    const { caption, visibility } = req.body; // Frontend se 'visibility' aayega

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Video upload karni padegi bhai" });
    }

    const reel = new Reel({
      author: req.user.id,
      mediaUrl: req.file.path, // Cloudinary Video URL
      caption: caption || "",
      // Agar user ne kuch select nahi kiya to default 'public' rahega
      visibility: visibility || "public", 
    });

    await reel.save();

    res.status(201).json({ success: true, message: "Reel uploaded!", reel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// -------------------------------------------------------
// 2. GET REELS FEED (Privacy Logic Yaha Hai 🧠)
// -------------------------------------------------------
exports.getAllReels = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // STEP A: Pehle user ki Friend List nikalo
    const friendships = await Friendship.find({
      status: "accepted",
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    });

    // Saare Doston ki IDs ka array
    const friendIds = friendships.map((f) =>
      f.sender.toString() === currentUserId.toString() ? f.receiver : f.sender
    );

    // STEP B: Query Banao (Complex Logic)
    // Humein wo Reels chahiye jo:
    // 1. PUBLIC hain (Sabki)
    // 2. PRIVATE hain (Lekin sirf DOSTON ki)
    // 3. MERI khud ki hain (Chahe Public, Private ya Only Me ho)

    const reels = await Reel.find({
      $or: [
        { visibility: "public" }, // Condition 1: Public sabko dikhe
        { 
          visibility: "private", 
          author: { $in: friendIds } // Condition 2: Private sirf doston ki dikhe
        },
        { author: currentUserId } // Condition 3: Apni reels hamesha dikhe (Only Me included)
      ]
    })
      .populate("author", "name avatar photoURL")
      .sort({ createdAt: -1 }); // Nayi reel sabse upar

    res.status(200).json({ success: true, reels });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Feed load nahi hui" });
  }
};

// -------------------------------------------------------
// 3. GET MY REELS (Profile Page ke liye)
// -------------------------------------------------------
exports.getMyReels = async (req, res) => {
  try {
    // Apni profile par user ko SAB dikhna chahiye (Public, Private, Only Me)
    const reels = await Reel.find({ author: req.user.id })
      .populate("author", "name avatar photoURL")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



// -------------------------------------------------------
// 4. UPDATE REEL (Caption or Visibility)
// -------------------------------------------------------
exports.updateReel = async (req, res) => {
  try {
    const { caption, visibility } = req.body;
    const reelId = req.params.id;
    const userId = req.user.id;

    // 1. Reel dhundo
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ success: false, error: "Reel nahi mili bhai" });
    }

    // 2. Authorization Check (Kya ye reel meri hai?)
    if (reel.author.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: "Ye reel tumhari nahi hai, tum edit nahi kar sakte!" 
      });
    }

    // 3. Update Fields (Jo data aaya hai wahi update karo)
    if (caption !== undefined) reel.caption = caption;
    if (visibility !== undefined) reel.visibility = visibility; // Public/Private change karne ke liye

    await reel.save();

    res.status(200).json({ 
      success: true, 
      message: "Reel updated successfully!", 
      reel 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



// -------------------------------------------------------
// 5. DELETE REEL
// -------------------------------------------------------
exports.deleteReel = async (req, res) => {
  try {
    const reelId = req.params.id;
    const userId = req.user.id;

    // 1. Reel dhundo
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(404).json({ success: false, error: "Reel nahi mili" });
    }

    // 2. Authorization Check (Sirf Author delete kar sakta hai)
    if (reel.author.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: "Tum kisi aur ki reel delete nahi kar sakte" 
      });
    }

    // 3. Database se uda do
    await reel.deleteOne();

    // (Optional: Future mein yahan Cloudinary se video delete karne ka code bhi laga sakte ho)

    res.status(200).json({ 
      success: true, 
      message: "Reel deleted successfully!" 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



exports.toggleLike = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ msg: "Reel not found" });

    // Check karo pehle se liked hai ya nahi
    const isLiked = reel.likes.includes(req.user.id);

    if (isLiked) {
      reel.likes.pull(req.user.id); // Unlike
    } else {
      reel.likes.push(req.user.id); // Like
    }

    await reel.save();
    res.json({ success: true, likes: reel.likes }); // Updated likes array bhejo
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
