/* GET /posts listing. */
var express = require('express');
var router = express.Router();
const Post = require("../models/Post");
const handleError = require("../helper/handleError");
const handleSuccess = require("../helper/handleSuccess");

/* 取得所有貼文 */
router.get("/", async (req, res, next) => {
    const posts = await Post.find();
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
            owner: data.owner, 
            content: data.content, 
            image: data.image
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
            owner: data.owner, 
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