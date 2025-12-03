// routes/friendRoutes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  removeFriend,
  getFriendStatuses,
  getMyFriends,
  getUserStats,
} = require("../controllers/friendController"); // Yeh file hum abhi banayenge

// 1. (Add Friend Button) -> Nayi request bhejna
// :id uss user ki hai jisko request bhej rahe hain
router.post("/send/:receiverId", authMiddleware, sendFriendRequest);

// 2. (Accept Button Page) -> Aapko aayi hui pending requests dekhna
router.get("/pending", authMiddleware, getPendingRequests);

// 3. (Accept Button) -> Request accept karna
// :id yahaan 'FriendRequest' ki ID hai
router.post("/accept/:requestId", authMiddleware, acceptFriendRequest);

// 4. (Reject Button) -> Request reject karna
// :id yahaan 'FriendRequest' ki ID hai
router.post("/reject/:requestId", authMiddleware, rejectFriendRequest);

// 5. (Bonus) -> Apne saare doston ki list dekhna
router.get("/list", authMiddleware, getFriendsList);

// 6. (Naya) -> Dost ko remove karna
router.delete("/remove/:friendId", authMiddleware, removeFriend);

// 7. (NEW) Get current status of all friends
router.get("/statuses", authMiddleware, getFriendStatuses);

// GET /api/friends/my-friends
router.get("/my-friends", authMiddleware, getMyFriends);

router.get("/stats", authMiddleware, getUserStats);

module.exports = router;