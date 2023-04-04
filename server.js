const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");
const headers = require('./helper/headers');
const Post = require('./models/Post');

dotenv.config({ path: "./.env.local" });

mongoose.connect("mongodb://localhost:27017/posts")
    .then(() => {
        console.log("資料庫連線成功");
    })
    .catch((error) => {
        console.error(error);
    });

const requestListener = async (req, res) => {

    // 取得所有貼文
    if ((req.url === "/posts") && (req.method === 'GET')) {
        const posts = await Post.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            posts
        }));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT_WEB_SERVER);