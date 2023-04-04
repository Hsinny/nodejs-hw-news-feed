const headers = require("./headers");

function handleError (response, error = null) {
    response.writeHead(400, headers);
    response.write(JSON.stringify({
        "status": 'failed',
        message: error?.message || "欄位錯誤，或無此 ID",
        error: error?.error || ""
    }));
    console.error(error);
    response.end();
}

module.exports = handleError;
