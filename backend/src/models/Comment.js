const mongoose = require('mongoose');

// Comment Schema: यह हर एक टिप्पणी (comment) का structure store करता है।
const CommentSchema = new mongoose.Schema({
    // 1. टिप्पणी का लेख़क (Author)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User Model से जुड़ा हुआ
        required: true
    },

    // 2. टिप्पणी किस पोस्ट पर की गई है
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Post Model से जुड़ा हुआ
        required: true
    },

    // 3. टिप्पणी का मुख्य पाठ (Comment Text)
    content: {
        type: String,
        required: true,
        trim: true,
    },

    // 4. TimeStamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Post ID के आधार पर fetching को तेज़ करने के लिए इंडेक्स (Index)
CommentSchema.index({ post: 1, createdAt: -1 });

// Model export करें
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;