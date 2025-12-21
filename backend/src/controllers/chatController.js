const Chat = require("../models/Chat");

// Create 1-to-1 chat
exports.createDirectChat = async (req, res) => {
  try {
    const { members } = req.body; // Expecting an array with ONE other user ID
    const myId = req.user.id;

    // Ensure 'members' has exactly two unique IDs (sender + receiver)
    if (!members || members.length !== 1 || members[0] === myId) {
      return res
        .status(400)
        .json({ msg: "Please provide exactly one other member ID." });
    }
    const participantIds = [myId, members[0]]; // Final list of two IDs

    // Use $all and $size to find regardless of order
    const existing = await Chat.findOne({
      type: "direct", // Use 'type' instead of 'isGroup' if you have it
      members: { $all: participantIds, $size: 2 }, // Check size is exactly 2
    });

    if (existing) {
      // console.log("Direct chat already exists:", existing._id);
      // Populate members before sending back, just like getChats
      const populatedChat = await existing.populate(
        "members",
        "name email photoURL bio"
      );
      return res.json(populatedChat);
    }

    // Create new chat
    const chat = new Chat({
      type: "direct",
      members: participantIds,
    });
    await chat.save();
    // Populate members before sending back
    const populatedNewChat = await chat.populate(
      "members",
      "name email photoURL bio"
    );
    console.log("Created new direct chat:", populatedNewChat._id);
    res.status(201).json(populatedNewChat);
  } catch (err) {
    console.error("Error creating direct chat:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Create group chat
exports.createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!members.includes(req.user.id)) members.push(req.user.id); // add creator

    const chat = new Chat({
      type: "group",
      name,
      members,
      admins: [req.user.id],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add member to group
exports.addMember = async (req, res) => {
  try {
    const { chatId, newMemberId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ msg: "Chat not found" });
    if (chat.type !== "group")
      return res.status(400).json({ msg: "Not a group chat" });
    if (!chat.admins.includes(req.user.id))
      return res.status(403).json({ msg: "Only admin can add" });

    if (!chat.members.includes(newMemberId)) chat.members.push(newMemberId);
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Remove member from group
exports.removeMember = async (req, res) => {
  try {
    const { chatId, memberId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ msg: "Chat not found" });
    if (chat.type !== "group")
      return res.status(400).json({ msg: "Not a group chat" });
    if (!chat.admins.includes(req.user.id))
      return res.status(403).json({ msg: "Only admin can remove" });

    chat.members = chat.members.filter((m) => m.toString() !== memberId);
    chat.admins = chat.admins.filter((a) => a.toString() !== memberId); // remove admin if removed
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get user chats (direct + groups)
// exports.getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({ members: req.user.id })
//       .populate("members", "name photoURL")
//       .populate("admins", "name photoURL")
//       .sort({ "lastMessage.timestamp": -1 });
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// Get user chats (direct + groups)
// exports.getChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({ members: req.user.id, archivedBy: { $ne: userId } })
//       // --- FIX: Select all necessary fields ---
//       .populate("members", "name email photoURL bio online lastSeen") // Added email, bio, online, lastSeen
//       .populate("admins", "name email photoURL") // Added email (admins might need profile view too)
//       // ------------------------------------
//       // Optional: Populate lastMessage sender details too
//       .populate({
//          path: 'lastMessage.senderId',
//          select: 'name photoURL email' // Select fields for the last message sender
//       })
//       .sort({ "lastMessage.timestamp": -1 }); // Sort by latest message first

//     res.json(chats);
//   } catch (err) {
//     console.error("Error fetching chats:", err); // Log the error
//     res.status(500).json({ msg: "Server error while fetching chats" });
//   }
// };

exports.getChats = async (req, res) => {
  // 1. FIX: Define the userId variable by getting it from the request object
  const userId = req.user.id;

  try {
    const chats = await Chat.find({
      members: userId, // 2. FIX: Use the defined 'userId' variable here // Filter out chats that the current user has archived
      archivedBy: { $ne: userId }, // 3. FIX: Use the defined 'userId' variable here
    }) // --- FIX: Select all necessary fields (good job here) ---
      .populate("members", "name email photoURL bio online lastSeen")
      .populate("admins", "name email photoURL") // Optional: Populate lastMessage sender details
      .populate({
        path: "lastMessage.senderId",
        select: "name photoURL email",
      })
      .sort({ "lastMessage.timestamp": -1 });

    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ msg: "Server error while fetching chats" });
  }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params; // It must read the ID from the URL parameter

  try {
    // --- SECURITY CHECK (Highly Recommended) ---
    // Ensure the user is a member of the chat before deleting it
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ msg: "Chat not found" });

    // Check if user is a member (or admin)
    if (!chat.members.includes(req.user.id)) {
      return res
        .status(403)
        .json({ msg: "You are not a member of this chat." });
    }
    // ------------------------------------------

    // Delete the chat and all associated messages (using pre/post save hooks on the model, or deleting messages here)
    await Chat.findByIdAndDelete(chatId);

    // Optional: Delete all messages associated with this chat (important!)
    // await Message.deleteMany({ chatId: chatId });

    res.json({ msg: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.muteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Chat dhoondhe
    const chat = await Chat.findById(chatId).select("isMutedBy");
    if (!chat) return res.status(404).json({ msg: "Chat not found" });

    // 2. Dekhe ki user ne pehle se mute kiya hai ya nahi
    const isCurrentlyMuted = chat.isMutedBy?.includes(userId);

    const updateOperation = isCurrentlyMuted
      ? { $pull: { isMutedBy: userId } } // Agar muted hai, toh unmute (pull out)
      : { $addToSet: { isMutedBy: userId } }; // Agar unmute hai, toh mute (add to set)

    const updatedChat = await Chat.findByIdAndUpdate(chatId, updateOperation, {
      new: true,
    });

    // Frontend ko batayein ki naya status kya hai
    res.json({
      msg: isCurrentlyMuted ? "Chat unmuted" : "Chat muted",
      isMuted: !isCurrentlyMuted, // Frontend ko naya status de diya
    });
  } catch (err) {
    console.error("Error muting chat:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * ✅ ARCHIVE CHAT
 * Removes chat from the main list by setting a status for the user.
 */
exports.archiveChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  try {
    // Hum maan rahe hain ki Chat model mein 'archivedBy' field hai
    // Jismein user IDs ka array store hota hai.

    // Is function ka simple kaam hai: User ki ID ko 'archivedBy' array mein add karna
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { archivedBy: userId } }, // User ki ID array mein add ki
      { new: true }
    );

    if (!updatedChat) return res.status(404).json({ msg: "Chat not found" });

    // Frontend ko confirmation de diya
    res.json({ msg: "Chat archived successfully" });
  } catch (err) {
    console.error("Error archiving chat:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getArchivedChats = async (req, res) => {
    const userId = req.user.id;
    try {
        const chats = await Chat.find({
            members: userId,
            archivedBy: userId // Find chats WHERE userId IS IN archivedBy array
        })
        .populate("members", "name email photoURL bio online lastSeen") // Populate necessary fields
        .populate("lastMessage.senderId", 'name photoURL') // Populate sender of last message
        .sort({ "lastMessage.timestamp": -1 }); // Or sort as needed

        res.json(chats);
    } catch (err) {
        console.error("Error fetching archived chats:", err);
        res.status(500).json({ msg: "Server error while fetching archived chats" });
    }
};

exports.unarchiveChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id; // Assuming user ID is available in req.user.id

  try {
    // $pull operator user ID ko 'archivedBy' array se hata dega
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { archivedBy: userId } },
      { new: true }
    );

    if (!updatedChat) return res.status(404).json({ msg: "Chat not found" });

    res.json({ msg: "Chat unarchived successfully" });
  } catch (err) {
    console.error("Error unarchiving chat:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


