

const mongoose = require("mongoose");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const SECRET = process.env.JWT_SECRET || "supersecret";


// Register user
const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please fill all fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};






// /**
//  * ✅ LOGIN USER (AUTHENTICATION)
//  */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👇 Password explicitly include karna hoga
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while login" });
  }
};






/**
 * ✅ GET ALL USERS (READ)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

/**
 * ✅ GET SINGLE USER BY ID (READ)
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching user" });
  }
};


/**
 * ✅ UPDATE USER (UPDATE)
 */
const updateUser = async (req, res) => {

  console.log("--- DEBUG UPDATE USER ---");
    console.log("ID from Token (req.user.id):", req.user.id);
    console.log("ID from URL (req.params.id):", req.params.id);
    console.log("Are they matching?", req.user.id === req.params.id);

  try {
    // --- 1. SECURITY CHECK ---
    // Check karein ki jo user request kar raha hai (req.user.id)
    // woh wahi user hai jisko woh update kar raha hai (req.params.id)
    if (req.user.id.toString() !== req.params.id) {
      return res
        .status(403) // 403 Forbidden Error
        .json({ msg: "Aap sirf apna account update kar sakte hain" });
    }
    // ----------------------------

    const { name, email, password, bio, photoURL } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email; // (Aapko check karna chahiye ki yeh email pehle se hai ya nahi)
    if (bio) updates.bio = bio;

    // if (photoURL) updates.photoURL = photoURL;

    if (req.file) {
      // Cloudinary storage ne already upload kar diya, URL yaha hai:
      updates.photoURL = req.file.path; 
    }

    // CASE B: Agar Avatar banaya (ReadyPlayerMe URL)
    else if (photoURL) {
      // Pehle is URL ko Cloudinary pe upload karke permanent save karo
      try {
        const result = await cloudinary.uploader.upload(photoURL, {
          folder: "chat_media" // Wahi folder name jo config me hai
        });
        updates.photoURL = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar Upload Error:", uploadError);
        // Agar fail ho jaye to purana URL hi rehne do ya error throw karo
      }
    }

    // Agar user naya password bhej raha hai, tabhi use hash karke update karein
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true, // Taaki response mein naya (updated) user aaye
    }).select("-password"); // Password chhod kar baaki sab bhejein

    if (!updatedUser)
      return res.status(404).json({ msg: "User not found to update" });

    res.json({ msg: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};


/**
 * ✅ DELETE USER (DELETE)
 */
const deleteUser = async (req, res) => {
  try {
    // --- 1. SECURITY CHECK ---
     if (req.user.id.toString() !== req.params.id) {
      return res
        .status(403) // 403 Forbidden Error
        .json({ msg: "Aap sirf apna account delete kar sakte hain" });
    }
    // ----------------------------

    // Aapko user delete karne se pehle usse related chats/messages
    // bhi delete karne padenge (future mein).
    
    const deleted = await User.findByIdAndDelete(req.params.id);
    
    if (!deleted)
      return res.status(404).json({ msg: "User not found to delete" });

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

// authController.js

/**
 * ✅ YEH ISTEMAL KAREIN (FAST & SECURE)
 * Users ko naam ya email se search karna
 */
const searchUsers = async (req, res) => {
  try {
    // 1. Logged-in user ki ID middleware se nikaalo
    const loggedInUserId = req.user?.id; // '?' safe access ke liye

    // 2. Check karo ki middleware ne user ID di ya nahi
    if (!loggedInUserId) {
      // Agar user ID nahi mili, toh 'Unauthorized' error bhejo
      return res.status(401).json({ msg: "User not authenticated" });
    }

    // 3. Mongoose query object banayo
    const query = {
      // Condition 1: Khud ko search results se hamesha hatao
      _id: { $ne: loggedInUserId }, 
    };

    // 4. Agar user ne kuch search kiya hai (q=Rupak), toh us condition ko query mein jodo
    if (req.query.q) {
      query.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { email: { $regex: req.query.q, $options: "i" } },
      ];
    }
    // Agar user ne kuch search nahi kiya (q=), toh query khaali rahegi
    // aur code database se (khud ko chhod kar) sabko le aayega.
    
    // 5. Database se users dhoondho
    const users = await User.find(query).select("-password");

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to search users" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    // --- 1. Exclusion List Banayein ---

    // A. Pehle, apni friend list nikaalein
    // Hum maan rahe hain ki aapke User model mein 'friends' array hai
    const user = await User.findById(loggedInUserId).select("friends");
    const friendsList = user.friends || []; // Yeh array [friendId1, friendId2]

    // B. Ab, un users ki list nikaalein jinko aapne request bhej di hai
    const sentRequests = await FriendRequest.find({
      sender: loggedInUserId,
      status: "pending", // Sirf pending requests
    }).select("receiver"); // Sirf receiver ki ID chahiye
    
    // sentRequests se IDs ka array banayein
    const sentRequestList = sentRequests.map(req => req.receiver);

    // C. Poori 'Exclude' list = (Aap + Aapke Dost + Aapki Bheji hui Requests)
    const excludeList = [
      new mongoose.Types.ObjectId(loggedInUserId), // Khud ko
      ...friendsList, // Doston ko
      ...sentRequestList // Pending requests waalon ko
    ];
    
    // --- 2. Nayi Aggregation Query ---
    const users = await User.aggregate([
      // 1. 'excludeList' mein jo bhi hai, use chhod kar baaki sabko match karo
      // '$nin' ka matlab hai "Not In" (is list mein na ho)
      { $match: { _id: { $nin: excludeList } } },
      
      // 2. Unmein se 20 random sample nikaalo
      { $sample: { size: 20 } },
      
      // 3. Password aur doosri sensitive info hata do
      { $project: { password: 0, fcmTokens: 0, __v: 0, updatedAt: 0, friends: 0 } }
    ]);

    res.json(users);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getSuggestedUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
};
