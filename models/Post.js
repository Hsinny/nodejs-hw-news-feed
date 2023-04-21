const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    avatar: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.ObjectId, // MongoDB 中的特有型別，document 的唯一識別碼
        ref: 'User', // Target Collection，對應 mongoose.model(name, schema) 的 name
        required: [true, '貼文用戶名稱未填寫']
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
