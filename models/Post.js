const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    avatar: {
        type: String,
        default: ''
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
        default: ''
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    },
}, {
    versionKey: false,
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
