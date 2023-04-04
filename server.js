const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env.local" });

mongoose.connect("mongodb://localhost:27017/posts")
    .then(() => {
        console.log("資料庫連線成功");
    })
    .catch((error) => {
        console.error(error);
    });

const requestListener = (req, res) => {
    console.log(req.url);
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT_WEB_SERVER);