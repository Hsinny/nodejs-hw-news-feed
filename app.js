const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postsRouter = require("./routes/posts");

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
app.use('/posts', postsRouter);

app.listen(process.env.PORT_WEB_SERVER);