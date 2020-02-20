const Middleware = require(__dirname + "/Middleware.js");

class SimpleMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "SimpleMiddleware";
    }

    constructor(middleware, options = {}) {
        super(options);
        this.middleware = middleware;
    }

    onMiddlewareWrap(application, controller, middleware) {
        const selfMiddleware = this;
        return function(request, response, next) {
            const context = selfMiddleware.onCreateContext(application, controller, request, response, next, {scope: this});
            return middleware.call(selfMiddleware, context, request, response, next);
        };
    }

    onResolve(controller, application) {
        const middlewares = [];
        [].concat(this.middleware).forEach(middleware => {
            const middlewareWrapped = this.onMiddlewareWrap(application, controller, middleware);
            middlewares.push(middlewareWrapped);
        });
        return middlewares;
    }

}

module.exports = SimpleMiddleware;