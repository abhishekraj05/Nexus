// controllers/friendController.js
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const Chat = require("../models/Chat"); 

/**
 * 1. SEND FRIEND REQUEST (Add Friend Button)
 */
exports.sendFriendRequest = async (req, res) => {
  const senderId = req.user.id; // Logged-in user (jo bhej raha hai)
  const { receiverId } = req.params; // Jisko bhej rahe hain

  try {
    // Check karein ki request pehle se toh nahi bheji gayi
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ msg: "Request already sent or received" });
    }

    // Nayi request banayein
    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.status(201).json({ msg: "Friend request sent", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 2. GET PENDING REQUESTS (Accept Page)
 */
exports.getPendingRequests = async (req, res) => {
  try {
    // Woh saari requests dhoondhein jiske receiver aap hain aur status pending hai
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "name photoURL bio"); // Bhejne waale ki details bhi le aayein

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 3. ACCEPT FRIEND REQUEST (Accept Button)
 * (YEH SABSE ZAROORI HAI)
 */
exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const receiverId = req.user.id; // Aap (jo accept kar raha hai)

  try {
    // 1. Request ko dhoondh kar update karein
    const request = await FriendRequest.findOneAndUpdate(
      { _id: requestId, receiver: receiverId, status: "pending" },
      { status: "accepted" },
      { new: true } // Taaki 'request' variable mein updated data aaye
    );

    if (!request) {
      return res.status(404).json({ msg: "Request not found or already handled" });
    }

    const senderId = request.sender;

    // 2. Dono users ke 'friends' array ko update karein
    // Receiver (Aap) ki friend list mein Sender ko add karein
    await User.findByIdAndUpdate(receiverId, {
      $push: { friends: senderId },
    });
    // Sender ki friend list mein Receiver (Aapko) ko add karein
    await User.findByIdAndUpdate(senderId, {
      $push: { friends: receiverId },
    });

    // 3. (Communication Start) -> Dono ke beech naya Chat room banayein
    // Check karein ki chat pehle se toh nahi hai
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [senderId, receiverId] },
    });

    // Agar chat nahi hai, toh nayi banayein
    if (!chat) {
      chat = await Chat.create({
        name: "One-on-One Chat",
        isGroup: false,
        members: [senderId, receiverId],
      });
    }

    res.json({ msg: "Friend request accepted", chat: chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 4. REJECT FRIEND REQUEST
 */
exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const receiverId = req.user.id;
  try {
    // FIX: Update karne ki jagah, request ko seedha DELETE kar do
    const request = await FriendRequest.findOneAndDelete({
      _id: requestId,
      receiver: receiverId,
      status: "pending" 
    });
    
    if (!request) {
      return res.status(404).json({ msg: "Request not found or already handled" });
    }
    res.json({ msg: "Friend request rejected (and deleted)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * 5. GET FRIENDS LIST
 */
exports.getFriendsList = async (req, res) => {
  try {
    // User ke document se 'friends' array ko populate karke bhej do
    const user = await User.findById(req.user.id).populate(
      "friends",
      "name email photoURL bio online lastSeen"
    );
    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.removeFriend = async (req, res) => {
  const myId = req.user.id;
  const { friendId } = req.params;

  try {
    // 1. Apni friends list se 'friendId' ko $pull (hatao)
    await User.findByIdAndUpdate(myId, {
      $pull: { friends: friendId },
    });

    // 2. Apne dost ki friends list se 'myId' ko $pull (hatao)
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: myId },
    });

    // 3. (Optional) Dono ke beech ka FriendRequest document bhi delete kar do
    await FriendRequest.findOneAndDelete({
      $or: [
        { sender: myId, receiver: friendId },
        { sender: friendId, receiver: myId },
      ],
    });

    // 4. (Optional but Recommended) Dono ke beech ka chat room bhi delete kar do
    await Chat.findOneAndDelete({
      isGroup: false,
      members: { $all: [myId, friendId] },
    });
    // Note: Isse messages bhi delete ho sakte hain (agar aapne cascading setup nahi kiya hai)

    res.json({ msg: "Friend removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.getFriendStatuses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("friends") // Get the friend IDs
            .populate("friends", "online lastSeen"); // Populate with ONLY online status and lastSeen

        if (!user || !user.friends) {
            return res.json({}); // Return empty object if no friends
        }

        const statuses = {};
        user.friends.forEach(friend => {
            statuses[friend._id] = friend.online ? true : friend.lastSeen;
        });

        res.json(statuses);
    } catch (err) {
        console.error("Error fetching friend statuses:", err);
        res.status(500).json({ msg: "Server Error" });
    }
};



exports.getMyFriends = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // console.log("🔍 Finding friends for User ID:", currentUserId);

    // 1. Database se friends dhoondo
    const friendships = await FriendRequest.find({
        status: 'accepted',
        $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).populate('sender receiver', 'name photoURL email'); // 👈 Check: 'photoURL' use kiya hai

    // console.log("✅ Total Friendships found:", friendships.length);

    // 2. List ko clean karo aur format sahi karo
    const friends = friendships.map(f => {
        // Decide karo dost kaun hai (Sender ya Receiver)
        const friendDoc = f.sender._id.toString() === currentUserId ? f.receiver : f.sender;

        // Agar dost ka user delete ho gaya ho, toh handle karo
        if (!friendDoc) return null;

        return {
            _id: friendDoc._id,
            name: friendDoc.name,
            // 👇 Frontend 'avatar' maangta hai, backend 'photoURL' deta hai. Hum yahan convert kar rahe hain.
            avatar: friendDoc.photoURL || "https://via.placeholder.com/40", 
            email: friendDoc.email
        };
    }).filter(f => f !== null); // Null values hata do

    // console.log("🚀 Final Friends List to send:", friends);

    res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error("❌ Error in getMyFriends:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


// ... baaki upar ka code same rahega ...

// 8. GET USER STATS (Friends & Requests Count)
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Friends Count (Status: 'accepted')
    // Note: Hum 'FriendRequest' model use kar rahe hain
    const friendsCount = await FriendRequest.countDocuments({
      status: 'accepted',
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // 2. Pending Requests (Status: 'pending', Receiver: Me)
    const requestsCount = await FriendRequest.countDocuments({
      receiver: userId,
      status: 'pending'
    });

    res.status(200).json({ 
      success: true, 
      friends: friendsCount, 
      requests: requestsCount 
    });

  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
