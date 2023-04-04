const dotenv = require("dotenv");
const http = require("http");
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

const requestListener = async (req, res) => {
    let body = "";
    
    /* 監聽收到的 HTTP 請求資料 */
    req.on("data", chunk => {
        body += chunk; // chunk: 接收到的請求資料片段
    });

    /* 取得所有貼文 */
    if ((req.url === "/posts") && (req.method === 'GET')) {
        const posts = await Post.find();
        handleSuccess(res, { posts: posts });

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
                    handleSuccess(res, { posts: newPost });
                } else {
                    handleError(res, { message: "用戶名稱或貼文內容未填寫" });
                }
            } catch (error) {
                handleError(res, {
                    message: "新增失敗", 
                    error: error
                });
            }
        });

    } else if ((req.url === "/posts") && (req.method === 'DELETE')) {
        /* 刪除所有貼文 */
        const posts = await Post.deleteMany({});
        handleSuccess(res, { posts: posts });

    } else if ((req.url.startsWith('/posts')) && (req.method === 'DELETE')) {
        /* 刪除單筆貼文 /posts/{id} */
        try {
            const id = req.url.split('/').pop();
            const deletePost = await Post.findByIdAndDelete(id); 
            handleSuccess(res, { posts: deletePost });
        } catch (error) {
            handleError(res, {
                message: "刪除失敗，此 ID 資料不存在",
                error: error
            });
        }
    } else if ((req.url.startsWith('/posts')) && (req.method === 'PATCH')) {
        /* 更新單筆資料 */
        req.on("end", async () => {
            /* HTTP 請求的所有資料都已經被接收完畢 */
            try {
                const data = JSON.parse(body);
                const id = req.url.split('/').pop();
                // TODO 更新資料防呆
                const updatePost = await Post.findByIdAndUpdate(id, data);
                handleSuccess(res, { posts: updatePost });
            
            } catch (error) {
                handleError(res, {
                    message: "更新失敗，此 ID 資料不存在，或未填寫更新欄位",
                    error: error
                });
            }
        });
    };
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT_WEB_SERVER);