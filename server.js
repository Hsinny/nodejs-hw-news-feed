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
    let body = "";
    
    /* 監聽收到的 HTTP 請求資料 */
    req.on("data", chunk => {
        body += chunk; // chunk: 接收到的請求資料片段
    });

    /* 取得所有貼文 */
    if ((req.url === "/posts") && (req.method === 'GET')) {
        const posts = await Post.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            posts
        }));
        res.end();

    } else if ((req.url === "/posts") && (req.method === 'POST')) {
        /* 新增貼文 */
        req.on("end", async () => {
            /* 當 HTTP 請求的所有資料都已經被接收完畢 */
            try {
                const data = JSON.parse(body);
               
                if ((data.owner !== undefined) && (data.content !== undefined)) {
                    const newPost = await Post.create({
                        avatar: data.avatar,
                        owner: data.owner,
                        content: data.content,
                        image: data.image,
                    });
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        post: newPost
                    }));
                } else {
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({
                        "status": "failed",
                        "message": "用戶名稱或貼文內容未填寫",
                    }));
                }
            } catch (error) {
                console.error(error);
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    "status": "failed",
                    "message": "新增失敗",
                    "error": error
                }));
            } finally {
                res.end();
            }
        });
    } else if ((req.url === "/posts") && (req.method === 'DELETE')) {
        /* 刪除所有貼文 */
        const posts = await Post.deleteMany({});
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": posts
        }));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT_WEB_SERVER);