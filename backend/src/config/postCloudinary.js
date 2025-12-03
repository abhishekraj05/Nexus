// backend/config/postCloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for posts
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";

    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("audio/")) {
      resourceType = "video";
    } else if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    } else {
      resourceType = "raw";
    }

    return {
      folder: "chat_media",
      resource_type: resourceType,
      allowed_formats: [
        "jpg","jpeg","png","gif",
        "mp4","mov","avi",
        "mp3","wav","ogg","m4a",
        "pdf","doc","docx",
        "ppt","pptx","xls","xlsx",
        "zip","rar","txt"
      ],
    };
  }
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
