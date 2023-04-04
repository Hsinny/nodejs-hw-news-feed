const http = require("http");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.local" });

const requestListener = (req, res) => {
    console.log(req.url);
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT_WEB_SERVER);