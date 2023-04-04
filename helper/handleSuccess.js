const headers = require("./headers");

function handleSuccess(response, data = null) {
    response.writeHead(200, headers);
    response.write(JSON.stringify({
        "status": "success",
        data: data
    }));
    response.end();
};

module.exports = handleSuccess;