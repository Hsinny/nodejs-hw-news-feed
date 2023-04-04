const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    avatar: {
        type: String,
    },
    owner: {
        type: String,
        required: [true, '用戶名稱未填寫']
    },
    content: {
        type: String,
        required: [true, '貼文內容未填寫']
    },
    image: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array
    },
}, {
    versionKey: false,
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
