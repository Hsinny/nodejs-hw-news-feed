const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require("./models/Post");
const handleError = require("./helper/handleError");
const handleSuccess = require("./helper/handleSuccess");

dotenv.config({ path: "./.env.local" });

mongoose.connect("mongodb://localhost:27017/posts")
    .then(() => {
        console.log("資料庫連線成功");
    })
    .catch((error) => {
        console.error(error);
    });

/* 執行 middleware 函式 (攔截 HTTP 請求後執行特定處理) */
app.use(express.json()); // 解析 HTTP 請求中的 body，並將解析結果作為 req.body 物件附加到請求物件上

/* 取得所有貼文 */
app.get("/posts", async (req, res) => {
    const posts = await Post.find();
    handleSuccess(res, { posts: posts });
});

/* 刪除所有貼文 */
app.delete("/posts", async (req, res) => {
   const posts =  await Post.deleteMany({});
   handleSuccess(res, { posts: posts });
});

/* 刪除單筆貼文 /posts/{id} */
app.delete("/posts/:postId", async (req, res) => {
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
app.post("/posts", async (req, res) => {
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
app.put("/posts/:postId", async (req, res) => {
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

app.listen(process.env.PORT_WEB_SERVER);