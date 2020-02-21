module.exports = function(tag, msg) {
    var ErrorObject = {
        status: "error",
        tag: tag,
        err_msg: msg,
        created: Date.now()
    };
    return JSON.stringify(ErrorObject);
}