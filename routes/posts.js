/* GET /posts listing. */
var express = require('express');
var router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User"); // 必須引入 ref 的 Model
const handleError = require("../helper/handleError");
const handleSuccess = require("../helper/handleSuccess");

/* 取得所有貼文 */
router.get("/", async (req, res, next) => {
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q)} : {}; // 搜尋關鍵字
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"; // 依照時間排序 1:升冪(小至大) -1:降冪(大至小)
    const posts = await Post.find(q).populate({
        path: "owner", // ref 的 Model 名稱
        select: "name avatar", // 指定要取出的欄位
    }).sort(timeSort);
    handleSuccess(res, { posts: posts });
});

/* 刪除所有貼文 */
router.delete("/", async (req, res) => {
    const posts =  await Post.deleteMany({});
    handleSuccess(res, { posts: posts });
 });

 /* 刪除單筆貼文 /posts/{id} */
router.delete("/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
        const deletePost = await Post.findByIdAndDelete(postId);
        handleSuccess(res, { post: deletePost });
    } catch (error) {
        handleError(res, {
            message:  "刪除失敗，此 ID 資料不存在",
            error: error
        });
    };
});

/* 新增貼文 */
router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const newPost = await Post.create({
            avatar: data.avatar,
            owner: data.owner, // 要給 User ID
            content: data.content, 
            image: 'https://picsum.photos/470/160', // data.image
        });
        handleSuccess(res, { post: newPost });
    } catch (error) {
        handleError(res, { 
            message: "用戶名稱或貼文內容未填寫",
            error: error
        });
    };
});

/* 更新單筆貼文 */
router.put("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const data = req.body;
    try {
        const updatePost = await Post.findByIdAndUpdate(postId, {
            avatar: data.avatar,
            content: data.content, 
            image: data.image
        });
        handleSuccess(res, { post: updatePost }); // 返回的是更新前的值 [TODO]吐更新後的值
    } catch (error) {
        handleError(res, { 
            message: "更新失敗，此 ID 資料不存在，或未填寫更新欄位",
            error: error
        });
    };
});

module.exports = router;