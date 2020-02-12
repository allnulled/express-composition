module.exports = function(context, request, response, next) {
    return response.send("Hello, " + (request.query.name ? request.query.name : "anonymous") + context._instance.symbol);
};