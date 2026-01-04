const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser, // getAllUsers, // <-- Ise hata diya (performance ke liye)
  searchUsers, // <-- 1. Naya searchUsers function import kiya
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getSuggestedUsers,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const upload = require("../config/cloudinary");

// Middleware ko sahi se import kiya
const { authMiddleware } = require("../middleware/authMiddleware");
// (Note: Agar authMiddleware.js mein 'export default' nahi hai, toh { authMiddleware } galat hoga)

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/", authMiddleware, getAllUsers); 
router.get("/search", authMiddleware, searchUsers); 
router.get("/suggestions", authMiddleware, getSuggestedUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware,upload.single("photo"), updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
