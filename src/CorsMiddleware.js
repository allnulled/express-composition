const cors = require("cors");
const Middleware = require(__dirname + "/Middleware.js");

class CorsMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "CorsMiddleware";
    }

    static get DEFAULT_OPTIONS() {
        return {};
    }

    constructor(options, extra = {}) {
        super(extra);
        this.options = options;
    }

    onResolve(controller, application) {
        // this method can be asynchronous
        return cors(this.options);
    }

    onCreateContext(application, controller, request, response, next) {
        return {};
    }
    
}

module.exports = CorsMiddleware;