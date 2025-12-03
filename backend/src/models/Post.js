const mongoose = require('mongoose');

// Post schema woh structure define karta hai jismein user ka content store hoga.
const PostSchema = new mongoose.Schema({
    // 1. Post ka lekhak (author)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Yeh User Model se judega
        required: true
    },

    // 2. Post ka mukhya content (text)
    caption: {
        type: String,
        trim: true,
        maxlength: 500 // Ek reasonable limit
    },

    // 3. Media file ka URL (Cloudinary ya S3 se)
    mediaUrl: {
        type: String,
        required: false // Caption ya media, koi ek toh hona chahiye
    },

    // 4. Media ka prakar (image, video, ya generic file)
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text'
    },

    // 5. Engagement metrics
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Jin users ne like kiya hai
    }],

    // Comments ki sankhya (achha hoga agar Comments ka alag collection ho)
    commentsCount: {
        type: Number,
        default: 0
    },

    // 6. Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing se fetching tez hoti hai (khaaskar feed ke liye)
PostSchema.index({ author: 1, createdAt: -1 });

// Model export karein
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;