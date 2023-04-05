const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

dotenv.config({ path: "./.env.local" });

mongoose.connect("mongodb://localhost:27017/posts")
    .then(() => {
        console.log("資料庫連線成功");
    })
    .catch((error) => {
        console.error(error);
    });

app.listen(process.env.PORT_WEB_SERVER);