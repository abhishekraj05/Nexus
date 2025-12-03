// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ✅ Check .env credentials
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary credentials missing in .env");
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("Uploading file type:", file.mimetype);

    const rawMimes = [
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
    ];

    let resourceType = "auto";

    // Audio & video -> video (Cloudinary treats audio as video)
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("audio/")) {
      resourceType = "video";
    }
    // Docs, txt, zip, rar -> raw (download)
    else if (rawMimes.includes(file.mimetype)) {
      resourceType = "raw";
    }
    // PDF -> auto (preview in browser)
    else if (file.mimetype === "application/pdf") {
      resourceType = "raw";
    }
    // Images -> auto
    else if (file.mimetype.startsWith("image/")) {
      resourceType = "auto";
    }

    return {
      folder: "chat_media", // Cloudinary folder
      resource_type: resourceType,
      allowed_formats: [
        "jpg","jpeg","png","gif",          // images
        "mp4","mov","avi",                 // videos
        "mp3","wav","ogg","m4a",           // audio
        "pdf","doc","docx",                // documents
        "ppt","pptx","xls","xlsx",         // office
        "zip","rar","txt"                  // archives & text
      ],
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
