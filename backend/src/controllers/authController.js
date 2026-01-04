

// const mongoose = require("mongoose");
// const User = require("../models/User");
// const FriendRequest = require("../models/FriendRequest");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary").v2;

// const SECRET = process.env.JWT_SECRET || "supersecret";


// // Register user
// const registerUser = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ msg: "Please fill all fields" });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({ name, email, password: hashed });

//     const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

//     res.status(201).json({ user, token });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };






// // /**
// //  * ✅ LOGIN USER (AUTHENTICATION)
// //  */
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 👇 Password explicitly include karna hoga
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

//     res.json({ user, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error while login" });
//   }
// };






// /**
//  * ✅ GET ALL USERS (READ)
//  */
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to fetch users" });
//   }
// };

// /**
//  * ✅ GET SINGLE USER BY ID (READ)
//  */
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Error fetching user" });
//   }
// };


// /**
//  * ✅ UPDATE USER (UPDATE)
//  */
// const updateUser = async (req, res) => {

//   console.log("--- DEBUG UPDATE USER ---");
//     console.log("ID from Token (req.user.id):", req.user.id);
//     console.log("ID from URL (req.params.id):", req.params.id);
//     console.log("Are they matching?", req.user.id === req.params.id);

//   try {
//     // --- 1. SECURITY CHECK ---
//     // Check karein ki jo user request kar raha hai (req.user.id)
//     // woh wahi user hai jisko woh update kar raha hai (req.params.id)
//     if (req.user.id.toString() !== req.params.id) {
//       return res
//         .status(403) // 403 Forbidden Error
//         .json({ msg: "Aap sirf apna account update kar sakte hain" });
//     }
//     // ----------------------------

//     const { name, email, password, bio, photoURL } = req.body;

//     const updates = {};
//     if (name) updates.name = name;
//     if (email) updates.email = email; // (Aapko check karna chahiye ki yeh email pehle se hai ya nahi)
//     if (bio) updates.bio = bio;

//     // if (photoURL) updates.photoURL = photoURL;

//     if (req.file) {
//       // Cloudinary storage ne already upload kar diya, URL yaha hai:
//       updates.photoURL = req.file.path; 
//     }

//     // CASE B: Agar Avatar banaya (ReadyPlayerMe URL)
//     else if (photoURL) {
//       // Pehle is URL ko Cloudinary pe upload karke permanent save karo
//       try {
//         const result = await cloudinary.uploader.upload(photoURL, {
//           folder: "chat_media" // Wahi folder name jo config me hai
//         });
//         updates.photoURL = result.secure_url;
//       } catch (uploadError) {
//         console.error("Avatar Upload Error:", uploadError);
//         // Agar fail ho jaye to purana URL hi rehne do ya error throw karo
//       }
//     }

//     // Agar user naya password bhej raha hai, tabhi use hash karke update karein
//     if (password) {
//       updates.password = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
//       new: true, // Taaki response mein naya (updated) user aaye
//     }).select("-password"); // Password chhod kar baaki sab bhejein

//     if (!updatedUser)
//       return res.status(404).json({ msg: "User not found to update" });

//     res.json({ msg: "User updated successfully", user: updatedUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to update user" });
//   }
// };


// /**
//  * ✅ DELETE USER (DELETE)
//  */
// const deleteUser = async (req, res) => {
//   try {
//     // --- 1. SECURITY CHECK ---
//      if (req.user.id.toString() !== req.params.id) {
//       return res
//         .status(403) // 403 Forbidden Error
//         .json({ msg: "Aap sirf apna account delete kar sakte hain" });
//     }
//     // ----------------------------

//     // Aapko user delete karne se pehle usse related chats/messages
//     // bhi delete karne padenge (future mein).
    
//     const deleted = await User.findByIdAndDelete(req.params.id);
    
//     if (!deleted)
//       return res.status(404).json({ msg: "User not found to delete" });

//     res.json({ msg: "User deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to delete user" });
//   }
// };

// // authController.js

// /**
//  * ✅ YEH ISTEMAL KAREIN (FAST & SECURE)
//  * Users ko naam ya email se search karna
//  */
// const searchUsers = async (req, res) => {
//   try {
//     // 1. Logged-in user ki ID middleware se nikaalo
//     const loggedInUserId = req.user?.id; // '?' safe access ke liye

//     // 2. Check karo ki middleware ne user ID di ya nahi
//     if (!loggedInUserId) {
//       // Agar user ID nahi mili, toh 'Unauthorized' error bhejo
//       return res.status(401).json({ msg: "User not authenticated" });
//     }

//     // 3. Mongoose query object banayo
//     const query = {
//       // Condition 1: Khud ko search results se hamesha hatao
//       _id: { $ne: loggedInUserId }, 
//     };

//     // 4. Agar user ne kuch search kiya hai (q=Rupak), toh us condition ko query mein jodo
//     if (req.query.q) {
//       query.$or = [
//         { name: { $regex: req.query.q, $options: "i" } },
//         { email: { $regex: req.query.q, $options: "i" } },
//       ];
//     }
//     // Agar user ne kuch search nahi kiya (q=), toh query khaali rahegi
//     // aur code database se (khud ko chhod kar) sabko le aayega.
    
//     // 5. Database se users dhoondho
//     const users = await User.find(query).select("-password");

//     res.json(users);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to search users" });
//   }
// };

// const getSuggestedUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.user?.id;
//     if (!loggedInUserId) {
//       return res.status(401).json({ msg: "User not authenticated" });
//     }

//     // --- 1. Exclusion List Banayein ---

//     // A. Pehle, apni friend list nikaalein
//     // Hum maan rahe hain ki aapke User model mein 'friends' array hai
//     const user = await User.findById(loggedInUserId).select("friends");
//     const friendsList = user.friends || []; // Yeh array [friendId1, friendId2]

//     // B. Ab, un users ki list nikaalein jinko aapne request bhej di hai
//     const sentRequests = await FriendRequest.find({
//       sender: loggedInUserId,
//       status: "pending", // Sirf pending requests
//     }).select("receiver"); // Sirf receiver ki ID chahiye
    
//     // sentRequests se IDs ka array banayein
//     const sentRequestList = sentRequests.map(req => req.receiver);

//     // C. Poori 'Exclude' list = (Aap + Aapke Dost + Aapki Bheji hui Requests)
//     const excludeList = [
//       new mongoose.Types.ObjectId(loggedInUserId), // Khud ko
//       ...friendsList, // Doston ko
//       ...sentRequestList // Pending requests waalon ko
//     ];
    
//     // --- 2. Nayi Aggregation Query ---
//     const users = await User.aggregate([
//       // 1. 'excludeList' mein jo bhi hai, use chhod kar baaki sabko match karo
//       // '$nin' ka matlab hai "Not In" (is list mein na ho)
//       { $match: { _id: { $nin: excludeList } } },
      
//       // 2. Unmein se 20 random sample nikaalo
//       { $sample: { size: 20 } },
      
//       // 3. Password aur doosri sensitive info hata do
//       { $project: { password: 0, fcmTokens: 0, __v: 0, updatedAt: 0, friends: 0 } }
//     ]);

//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching suggestions:", err);
//     res.status(500).json({ msg: "Failed to fetch users" });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getSuggestedUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   searchUsers,
// };




// const mongoose = require("mongoose");
// const User = require("../models/User");
// const TempUser = require("../models/TempUser"); // ⚠️ TempUser Model Zaroori Hai
// const FriendRequest = require("../models/FriendRequest");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary").v2;
// const nodemailer = require("nodemailer");

// const SECRET = process.env.JWT_SECRET || "supersecret";

// // --- 📧 EMAIL CONFIGURATION ---
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com", 
//   port: 465, 
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS, 
//   },
// });

// // --- 🎨 FINAL EMAIL TEMPLATE (Colorful Icons + Button) ---
// // --- 🎨 EMAIL TEMPLATE ---
// // 👇 Colorful & Professional Email Template (Pitch Black Background)
// const getOtpTemplate = (name, otp) => {
  
//   const links = {
//     website: "https://crjoin.online", 
//     twitter: "https://x.com/cod92570",
//     instagram: "https://www.instagram.com/codrexa?utm_source=qr&igsh=MXFsamFrazNhODZpYQ%3D%3D",
//     facebook: "https://www.facebook.com/profile.php?id=61579396951220"
//   };

//   // 👇 COLORFUL ICONS
//   const icons = {
//     fb: "https://img.icons8.com/fluency/48/facebook-new.png",
//     insta: "https://img.icons8.com/fluency/48/instagram-new.png",
//     twitter: "https://img.icons8.com/ios-filled/50/ffffff/twitterx.png",
//     animatedLock: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0bHpmYXg5b212eXF0cm55aW14bW53Ym15cW14bW53Ym15cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/JIx89W2t0Qd7E5VjFm/giphy.gif"
//   };

//   const colors = {
//     background: "#000000",      // 👈 CHANGE: Pure Pitch Black
//     cardBg: "#1e293b",          // Slate Gray Card (Contrast ke liye zaroori hai)
//     textPrimary: "#f8fafc",     // White text
//     textSecondary: "#94a3b8",   // Soft Gray text
//     accentBlue: "#3B82F6",      // Bright Blue Button/Highlights
//     otpBg: "#172554",           // Deep Blue Box
//     otpText: "#60A5FA",         // Lighter Blue Text
//     divider: "#334155"          // Subtle Divider
//   };

//   return `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
//       <div style="background-color: ${colors.cardBg}; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(255,255,255,0.05); color: ${colors.textPrimary}; border: 1px solid ${colors.divider};">
        
//         <div style="text-align: center; margin-bottom: 20px;">
//             <img src="${icons.animatedLock}" alt="Security" width="70" style="display: block; margin: 0 auto;">
//         </div>

//         <div style="text-align: center; margin-bottom: 30px;">
//           <h1 style="color: ${colors.accentBlue}; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: 1px;">NEXUS</h1>
//           <p style="color: ${colors.textSecondary}; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 3px;">Connect & Share</p>
//         </div>

//         <hr style="border: none; border-top: 1px solid ${colors.divider}; margin: 25px 0;">

//         <p style="color: ${colors.textPrimary}; font-size: 18px; margin-bottom: 20px; text-align: center;">Hello <strong>${name}</strong></p>
        
//         <p style="color: ${colors.textSecondary}; line-height: 1.6; font-size: 16px; text-align: center;">
//           Welcome to <strong>Nexus</strong>! To activate your account, simply enter the verification code below.
//         </p>

//         <div style="background-color: ${colors.otpBg}; border: 2px dashed ${colors.accentBlue}; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 20px;">
//           <span style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: ${colors.otpText}; font-family: monospace;">
//             ${otp}
//           </span>
//         </div>

//         <p style="color: ${colors.textSecondary}; font-size: 14px; text-align: center; margin-bottom: 30px;">
//           (This code is valid for 10 minutes)
//         </p>

//         <div style="text-align: center; margin-bottom: 40px;">
//             <a href="${links.website}" style="background-color: ${colors.accentBlue}; color: white; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);">
//                 Visit Website
//             </a>
//         </div>

//         <hr style="border: none; border-top: 1px solid ${colors.divider}; margin: 30px 0;">

//         <div style="text-align: center; margin-bottom: 20px;">
//             <p style="color: ${colors.textSecondary}; font-size: 12px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Join our Community</p>
            
//             <a href="${links.twitter}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//                 <img src="${icons.twitter}" alt="Twitter" width="32" height="32" style="vertical-align: middle;">
//             </a>

//             <a href="${links.instagram}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//                 <img src="${icons.insta}" alt="Instagram" width="32" height="32" style="vertical-align: middle;">
//             </a>
            
//             <a href="${links.facebook}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//                 <img src="${icons.fb}" alt="Facebook" width="32" height="32" style="vertical-align: middle;">
//             </a>
//         </div>

//         <div style="text-align: center; color: ${colors.textSecondary}; font-size: 12px; margin-top: 20px;">
//           <p>&copy; ${new Date().getFullYear()} Nexus App. All rights reserved.</p>
//           <p style="margin-top: 5px;">
//              <a href="${links.website}" style="color: ${colors.accentBlue}; text-decoration: none;">www.crjoin.online</a>
//           </p>
//         </div>

//       </div>
//     </div>
//   `;
// };
// // --- AUTH CONTROLLERS ---

// /**
//  * ✅ REGISTER USER (Save to Temp & Send Email)
//  */
// const registerUser = async (req, res) => {
//   try {
//     console.log("👉 1. Register Request Received:", req.body.email);
//     const { name, email, password, username } = req.body;

//     if (!name || !email || !password || !username) {
//         return res.status(400).json({ msg: "Please fill all fields" });
//     }

//     // Check Main DB
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Clean Old Temp Data
//     await TempUser.findOneAndDelete({ email });

//     // Create Temp User
//     console.log("👉 2. Creating TempUser...");
//     await TempUser.create({
//       name, username, email, password: hashed, otp
//     });

//     // Send Email
//     console.log("👉 3. Sending Email...");
//     await transporter.sendMail({
//       from: `"Nexus Team" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Verify your Nexus Account",
//       html: getOtpTemplate(name, otp),
//     });

//     console.log("✅ Email Sent Successfully! 🚀");
//     res.status(201).json({ msg: "OTP sent! Check email." });

//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// /**
//  * ✅ VERIFY OTP (Move Temp -> Main DB)
//  */
// const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     // 1. TempUser mein dhoondo
//     const tempUser = await TempUser.findOne({ email });

//     if (!tempUser) {
//       return res.status(400).json({ msg: "OTP Expired or Invalid Data. Register again." });
//     }

//     // 2. OTP Check karo
//     if (tempUser.otp !== otp) {
//       return res.status(400).json({ msg: "Invalid OTP" });
//     }

//     // 3. Ab Final User Create karo
//     const newUser = await User.create({
//       name: tempUser.name,
//       username: tempUser.username,
//       email: tempUser.email,
//       password: tempUser.password, // Already hashed
//       isVerified: true,
//       photoURL: "https://api.dicebear.com/7.x/initials/svg?seed=" + tempUser.name
//     });

//     // 4. Temp se data delete kar do
//     await TempUser.deleteOne({ email });

//     // 5. Token do
//     const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "7d" });

//     res.json({
//       msg: "Account Created Successfully!",
//       token,
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         username: newUser.username,
//         email: newUser.email,
//         photoURL: newUser.photoURL
//       },
//     });

//   } catch (err) {
//     console.error("❌ Verify OTP Error:", err);
//     res.status(500).json({ msg: "Verification Failed" });
//   }
// };

// /**
//  * ✅ LOGIN USER
//  */
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Check Verified Status
//     if (!user.isVerified) {
//        return res.status(400).json({ msg: "Please verify your email first." });
//     }

//     const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

//     res.json({ user, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error while login" });
//   }
// };

// // --- CRUD Functions ---

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to fetch users" });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching user" });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     if (req.user.id.toString() !== req.params.id) {
//       return res.status(403).json({ msg: "Unauthorized" });
//     }

//     const { name, email, password, bio, photoURL } = req.body;
//     const updates = {};
//     if (name) updates.name = name;
//     if (email) updates.email = email; 
//     if (bio) updates.bio = bio;

//     if (req.file) {
//       updates.photoURL = req.file.path; 
//     } else if (photoURL) {
//       try {
//         const result = await cloudinary.uploader.upload(photoURL, { folder: "chat_media" });
//         updates.photoURL = result.secure_url;
//       } catch (uploadError) {
//         console.error("Avatar Upload Error:", uploadError);
//       }
//     }

//     if (password) {
//       updates.password = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password"); 

//     if (!updatedUser) return res.status(404).json({ msg: "User not found" });

//     res.json({ msg: "User updated successfully", user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to update user" });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//       if (req.user.id.toString() !== req.params.id) {
//       return res.status(403).json({ msg: "Unauthorized" });
//     }
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ msg: "User not found" });
//     res.json({ msg: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to delete user" });
//   }
// };

// const searchUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.user?.id; 
//     if (!loggedInUserId) return res.status(401).json({ msg: "Unauthorized" });

//     const query = { _id: { $ne: loggedInUserId } };

//     if (req.query.q) {
//       query.$or = [
//         { name: { $regex: req.query.q, $options: "i" } },
//         { email: { $regex: req.query.q, $options: "i" } },
//         { username: { $regex: req.query.q, $options: "i" } }, 
//       ];
//     }
    
//     const users = await User.find(query).select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to search users" });
//   }
// };

// const getSuggestedUsers = async (req, res) => {
//   try {
//     const loggedInUserId = req.user?.id;
//     if (!loggedInUserId) return res.status(401).json({ msg: "Unauthorized" });

//     const user = await User.findById(loggedInUserId).select("friends");
//     const friendsList = user.friends || []; 

//     const sentRequests = await FriendRequest.find({
//       sender: loggedInUserId, status: "pending", 
//     }).select("receiver"); 
    
//     const sentRequestList = sentRequests.map(req => req.receiver);
//     const excludeList = [ new mongoose.Types.ObjectId(loggedInUserId), ...friendsList, ...sentRequestList ];
    
//     const users = await User.aggregate([
//       { $match: { _id: { $nin: excludeList } } },
//       { $sample: { size: 20 } },
//       { $project: { password: 0, fcmTokens: 0, __v: 0, updatedAt: 0, friends: 0 } }
//     ]);

//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching suggestions:", err);
//     res.status(500).json({ msg: "Failed to fetch users" });
//   }
// };

// module.exports = {
//   registerUser,
//   verifyOTP,
//   loginUser,
//   getAllUsers,
//   getSuggestedUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   searchUsers,
// };









const mongoose = require("mongoose");
const User = require("../models/User");
const TempUser = require("../models/TempUser"); 
const FriendRequest = require("../models/FriendRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

const SECRET = process.env.JWT_SECRET || "supersecret";

// --- 📧 EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", 
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// ==========================================
// 🎨 TEMPLATE 1: VERIFICATION OTP (Blue/Black)
// ==========================================
// const getOtpTemplate = (name, otp) => {
 
//  const links = {
//   website: "https://crjoin.online", 
//   twitter: "https://x.com/cod92570",
//   instagram: "https://www.instagram.com/codrexa?utm_source=qr&igsh=MXFsamFrazNhODZpYQ%3D%3D",
//   facebook: "https://www.facebook.com/profile.php?id=61579396951220"
// };

//  // 👇 COLORFUL ICONS (Original Colors)
//  const icons = {
//   // Facebook: Original Blue Color
//   fb: "https://img.icons8.com/fluency/48/facebook-new.png",
  
//   // Instagram: Original Gradient Color
//   insta: "https://img.icons8.com/fluency/48/instagram-new.png",
  
//   // X (Twitter): White is best for Dark Mode
//  twitter: "https://img.icons8.com/ios-filled/50/ffffff/twitterx.png",
//  // Security Icon (GIF)
//  animatedLock: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0bHpmYXg5b212eXF0cm55aW14bW53Ym15cW14bW53Ym15cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/JIx89W2t0Qd7E5VjFm/giphy.gif"
//  };

//  const colors = {
//  background: "#0f172a", // Deep Navy/Black
//  cardBg: "#1e293b",// Slate Gray Card
//  textPrimary: "#f8fafc",  // White text
//  textSecondary: "#94a3b8",  // Soft Gray text
//  accentBlue: "#3B82F6", // Bright Blue Button
//  otpBg: "#172554",  // Deep Blue Box
//  otpText: "#60A5FA", // Lighter Blue Text
//  divider: "#334155" // Subtle Divider
//  };

//  return `
//  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
// <div style="background-color: ${colors.cardBg}; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); color: ${colors.textPrimary}; border: 1px solid ${colors.divider};">

//  <div style="text-align: center; margin-bottom: 20px;">
//  <img src="${icons.animatedLock}" alt="Security" width="70" style="display: block; margin: 0 auto;">
//  </div>

//  <div style="text-align: center; margin-bottom: 30px;">
//   <h1 style="color: ${colors.accentBlue}; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: 1px;">NEXUS</h1>
//   <p style="color: ${colors.textSecondary}; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 3px;">Connect & Share</p>
//  </div>

//  <hr style="border: none; border-top: 1px solid ${colors.divider}; margin: 25px 0;">

//  <p style="color: ${colors.textPrimary}; font-size: 18px; margin-bottom: 20px; text-align: center;">Hello <strong>${name}</strong>, 👋</p>
 
//  <p style="color: ${colors.textSecondary}; line-height: 1.6; font-size: 16px; text-align: center;">
//   Welcome to <strong>Nexus</strong>! To activate your account, simply enter the verification code below.
//  </p>

//  <div style="background-color: ${colors.otpBg}; border: 2px dashed ${colors.accentBlue}; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 20px;">
//   <span style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: ${colors.otpText}; font-family: monospace;">
//   ${otp}
//   </span>
//  </div>

//  <p style="color: ${colors.textSecondary}; font-size: 14px; text-align: center; margin-bottom: 30px;">
//   (This code is valid for 10 minutes)
//  </p>

//  <div style="text-align: center; margin-bottom: 40px;">
//   <a href="${links.website}" style="background-color: ${colors.accentBlue}; color: white; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);">
//   Visit Website
//   </a>
//  </div>

//  <hr style="border: none; border-top: 1px solid ${colors.divider}; margin: 30px 0;">

//  <div style="text-align: center; margin-bottom: 20px;">
//   <p style="color: ${colors.textSecondary}; font-size: 12px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Join our Community</p>
  
//   <a href="${links.twitter}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//   <img src="${icons.twitter}" alt="Twitter" width="32" height="32" style="vertical-align: middle;">
//   </a>

//   <a href="${links.instagram}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//   <img src="${icons.insta}" alt="Instagram" width="32" height="32" style="vertical-align: middle;">
//   </a>
  
//   <a href="${links.facebook}" target="_blank" style="text-decoration: none; margin: 0 12px; display: inline-block; transition: transform 0.2s;">
//   <img src="${icons.fb}" alt="Facebook" width="32" height="32" style="vertical-align: middle;">
//   </a>
//  </div>

//  <div style="text-align: center; color: ${colors.textSecondary}; font-size: 12px; margin-top: 20px;">
//   <p>&copy; ${new Date().getFullYear()} Nexus App. All rights reserved.</p>
//   <p style="margin-top: 5px;">
//   <a href="${links.website}" style="color: ${colors.accentBlue}; text-decoration: none;">www.crjoin.online</a>
//   </p>
//  </div>

//   </div>
//  </div>
//  `;
// };  



// 👇 Colorful & Professional Email Template
const getOtpTemplate = (name, otp) => {

  const links = {
    website: "https://crjoin.online", 
    twitter: "https://x.com/cod92570",
    instagram: "https://www.instagram.com/codrexa?utm_source=qr&igsh=MXFsamFrazNhODZpYQ%3D%3D",
    facebook: "https://www.facebook.com/profile.php?id=61579396951220"
  };

  // ✅ OFFICIAL BRAND COLOR ICONS
  const icons = {
    fb: "https://img.icons8.com/color/48/facebook-new.png",
    insta: "https://img.icons8.com/fluency/48/instagram-new.png",
    twitter: "https://img.icons8.com/color/48/twitterx.png",
    animatedLock: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0bHpmYXg5b212eXF0cm55aW14bW53Ym15cW14bW53Ym15cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/JIx89W2t0Qd7E5VjFm/giphy.gif"
  };

  const colors = {
    background: "#121212",
    cardBg: "#1E1E1E",
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0A0",
    accentBlue: "#3B82F6",
    otpBg: "#172554",
    otpText: "#60A5FA",
    divider: "#333333"
  };

  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
    <div style="background-color: ${colors.cardBg}; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.5); color: ${colors.textPrimary}; border: 1px solid #333;">

      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${icons.animatedLock}" width="60" />
        <p style="font-size:12px;color:#22c55e;margin-top:6px;">
           Authorized & Secure Communication
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${links.website}" style="text-decoration:none;">
          <h1 style="color:${colors.accentBlue};margin:0;font-size:32px;font-weight:800;">NEXUS</h1>
        </a>
        <p style="color:${colors.textSecondary};font-size:13px;letter-spacing:2px;">Connect & Share</p>
      </div>

      <hr style="border-top:1px solid ${colors.divider};border:none;">

      <p style="font-size:18px;">Hello <strong>${name}</strong>,</p>
      <p style="color:${colors.textSecondary};font-size:16px;">
        To securely access your <strong>Nexus</strong> account, use the OTP below.
      </p>

      <div style="background:${colors.otpBg};border:2px dashed ${colors.accentBlue};padding:20px;text-align:center;border-radius:12px;margin:30px 0;">
        <span style="font-size:36px;font-weight:900;letter-spacing:8px;color:${colors.otpText};font-family:monospace;">
          ${otp}
        </span>
      </div>

      <p style="text-align:center;color:${colors.textSecondary};font-size:14px;">
        OTP valid for 10 minutes • Do not share this code
      </p>

      <hr style="border-top:1px solid ${colors.divider};border:none;margin:30px 0;">

      <!-- ✅ SOCIAL MEDIA WITH BRAND COLORS -->
      <div style="text-align:center;">
        <p style="font-size:12px;color:${colors.textSecondary};">Official Nexus Channels</p>

        <a href="${links.twitter}" target="_blank" style="margin:0 10px;">
          <img src="${icons.twitter}" width="28">
        </a>
        <a href="${links.instagram}" target="_blank" style="margin:0 10px;">
          <img src="${icons.insta}" width="28">
        </a>
        <a href="${links.facebook}" target="_blank" style="margin:0 10px;">
          <img src="${icons.fb}" width="28">
        </a>
      </div>

      <!-- ✅ AUTHORIZED FOOTER -->
      <div style="text-align:center;color:#6b7280;font-size:11px;margin-top:25px;">
        <p>© ${new Date().getFullYear()} Nexus App</p>
        <p>Authorized Email • Sent from official Nexus servers</p>
        <a href="${links.website}" style="color:#6b7280;text-decoration:none;">
          www.crjoin.online
        </a>
      </div>

    </div>
  </div>
  `;
};




// ==========================================
// 🎨 TEMPLATE 2: RESET PASSWORD (Red/Black)
// ==========================================
const getResetTemplate = (name, otp) => {
  const colors = {
    background: "#000000",
    cardBg: "#1e293b",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accentRed: "#EF4444", // Red color for Reset Warning
    otpBg: "#450a0a",     // Dark Red Box
    otpText: "#F87171",   // Light Red Text
    divider: "#334155"
  };

  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
      <div style="background-color: ${colors.cardBg}; padding: 40px; border-radius: 16px; border: 1px solid ${colors.divider};">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: ${colors.accentRed}; margin: 0; font-size: 32px; font-weight: 800;">RESET PASSWORD</h1>
          <p style="color: ${colors.textSecondary}; font-size: 14px; margin-top: 5px; letter-spacing: 2px;">Action Required</p>
        </div>

        <hr style="border: none; border-top: 1px solid ${colors.divider}; margin: 25px 0;">

        <p style="color: ${colors.textPrimary}; font-size: 18px; text-align: center;">Hello <strong>${name}</strong>,</p>
        
        <p style="color: ${colors.textSecondary}; line-height: 1.6; text-align: center;">
          We received a request to reset your password. Use the code below to set a new password.
        </p>

        <div style="background-color: ${colors.otpBg}; border: 2px dashed ${colors.accentRed}; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 20px;">
          <span style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: ${colors.otpText}; font-family: monospace;">
            ${otp}
          </span>
        </div>

        <p style="color: ${colors.textSecondary}; font-size: 14px; text-align: center;">
          This code expires in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;
};






// --- AUTH CONTROLLERS ---

/**
 * ✅ REGISTER USER (Save to Temp & Send Email)
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean Old Temp Data
    await TempUser.findOneAndDelete({ email });

    // Create Temp User
    await TempUser.create({
      name, username, email, password: hashed, otp
    });

    // Send Email (Using Blue Template)
    await transporter.sendMail({
      from: `"Nexus Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Nexus Account",
      html: getOtpTemplate(name, otp),
    });

    res.status(201).json({ msg: "OTP sent! Check email." });

  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * ✅ VERIFY OTP (Move Temp -> Main DB)
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ msg: "OTP Expired or Invalid Data. Register again." });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const newUser = await User.create({
      name: tempUser.name,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true,
      photoURL: "https://api.dicebear.com/7.x/initials/svg?seed=" + tempUser.name
    });

    await TempUser.deleteOne({ email });

    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "7d" });

    res.json({
      msg: "Account Created Successfully!",
      token,
      user: { _id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email, photoURL: newUser.photoURL },
    });

  } catch (err) {
    console.error("❌ Verify Error:", err);
    res.status(500).json({ msg: "Verification Failed" });
  }
};

/**
 * ✅ LOGIN USER
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
       return res.status(400).json({ msg: "Please verify your email first." });
    }

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while login" });
  }
};

/**
 * ✅ FORGOT PASSWORD (Send Reset OTP)
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Send Email (Using Red Template)
    await transporter.sendMail({
      from: `"Nexus Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password - Nexus",
      html: getResetTemplate(user.name, otp),
    });

    res.json({ msg: "Password Reset OTP sent to email!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * ✅ RESET PASSWORD (Verify OTP & Change Password)
 */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ 
      email, 
      resetOtp: otp, 
      resetOtpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or Expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ msg: "Password Changed Successfully! Please Login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// --- CRUD Functions ---

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user.id.toString() !== req.params.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const { name, email, password, bio, photoURL, username } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email; 
    if (bio) updates.bio = bio;

    if (req.file) {
      updates.photoURL = req.file.path; 
    } else if (photoURL) {
      try {
        const result = await cloudinary.uploader.upload(photoURL, { folder: "chat_media" });
        updates.photoURL = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar Upload Error:", uploadError);
      }
    }

    if (username) {
        // Check karo ki ye username kisi aur ke paas to nahi hai?
        // Hum dhoond rahe hain aisa user jiska username same ho, LEKIN ID alag ho
        const existingUser = await User.findOne({ username });
        
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return res.status(400).json({ msg: "Username already taken. Please choose another." });
        }
        
        updates.username = username;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password"); 

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
      if (req.user.id.toString() !== req.params.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user?.id; 
    if (!loggedInUserId) return res.status(401).json({ msg: "Unauthorized" });

    const query = { _id: { $ne: loggedInUserId } };

    if (req.query.q) {
      query.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { email: { $regex: req.query.q, $options: "i" } },
        { username: { $regex: req.query.q, $options: "i" } }, 
      ];
    }
    
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to search users" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) return res.status(401).json({ msg: "Unauthorized" });

    const user = await User.findById(loggedInUserId).select("friends");
    const friendsList = user.friends || []; 

    const sentRequests = await FriendRequest.find({
      sender: loggedInUserId, status: "pending", 
    }).select("receiver"); 
    
    const sentRequestList = sentRequests.map(req => req.receiver);
    const excludeList = [ new mongoose.Types.ObjectId(loggedInUserId), ...friendsList, ...sentRequestList ];
    
    const users = await User.aggregate([
      { $match: { _id: { $nin: excludeList } } },
      { $sample: { size: 20 } },
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
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSuggestedUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
};