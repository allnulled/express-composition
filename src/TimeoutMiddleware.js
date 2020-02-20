const timeout = require("connect-timeout");
const Middleware = require(__dirname + "/Middleware.js");

class TimeoutMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "TimeoutMiddleware";
    }

    static get DEFAULT_OPTIONS() {
        return {}
    }

    static handleError(handler) {
        return (request, response, next) => {
            if(!request.timedout) {
                return next();
            }
            return handler(request, response, next);
        };
    }

    constructor(timeoutSentence) {
        super({});
        this.timeout = timeoutSentence;
    }

    onResolve(controller, application) {
        return timeout(this.timeout);
    }

}

module.exports = TimeoutMiddleware;