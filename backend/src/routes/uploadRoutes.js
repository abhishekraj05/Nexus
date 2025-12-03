// const express = require('express');
// const router = express.Router();
// const { authMiddleware } = require('../middleware/authMiddleware');
// const upload = require('../config/cloudinary'); // Cloudinary config import karein

// /**
//  * @route   POST /api/upload
//  * @desc    Upload a file (image, video, doc)
//  * @access  Private
//  */
// // 'media' woh field name hai jo frontend bhejega
// // .single() ka matlab hai ek baar mein 1 file
// router.post('/', authMiddleware, upload.single('media'), (req, res) => {
//   try {
//     console.log("Incoming file:", JSON.stringify(req.file, null, 2));
//     if (!req.file) {
//       return res.status(400).json({ msg: 'No file uploaded.' });
//     }
    
//     // Cloudinary 'req.file.path' mein secure URL bhejta hai
//     res.status(201).json({
//       msg: 'File uploaded successfully',
//       url: req.file.path, // Yeh URL hai: "https://res.cloudinary.com/..."
//       fileType: req.file.mimetype // e.g., "image/jpeg", "video/mp4"
//     });

//   } catch (error) {
//   console.error("Upload Error message:", error.message);
//   console.error("Upload Error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
//   res.status(500).json({ msg: "Server error during upload.", error: error.message });
// }
// });

// module.exports = router;











const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const { authMiddleware } = require("../middleware/authMiddleware");
const util = require("util");

router.post("/", authMiddleware, upload.single("media"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    console.log("Incoming file:", JSON.stringify(req.file, null, 2));

    res.status(201).json({
      msg: "File uploaded successfully",
      url: req.file.path,
      fileType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload Error message:", error.message);
    console.error(
      "Full Upload Error object:",
      util.inspect(error, { showHidden: false, depth: null })
    );
    res
      .status(500)
      .json({ msg: "Server error during upload.", error: error.message });
  }
});

module.exports = router;
