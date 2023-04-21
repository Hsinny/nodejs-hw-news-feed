const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "請輸入名字"]
    }, 
    email: {
        type: String, 
        required: [true, "請輸入 Email"],
        unique: true,
        lowercase: true,
        select: false, 
    },
    avatar: {
        type: String, 
        default: "",
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
