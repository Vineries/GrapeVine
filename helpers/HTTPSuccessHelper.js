module.exports = function(data) {
    var ResponseObject = {
        status: "success",
        data: data,
        created: Date.now()
    };
    return JSON.stringify(ResponseObject);
}