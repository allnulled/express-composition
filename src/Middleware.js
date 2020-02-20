const Composable = require(__dirname + "/Composable.js");

class Middleware extends Composable {

    static get MIDDLEWARE_ID() {
        return "Middleware";
    }

    static get DEFAULT_OPTIONS() {
        return {
            middleware: []
        };
    }

    static create(...args) {
        return new this(...args);
    }

    constructor(options) {
        super(options);
    }

    onResolve(controller, application) {
        // this method can be asynchronous
        return this.middleware;
    }

    onCreateContext(application, controller, request, response, next) {
        return {
            application,
            controller,
            request,
            response,
            next,
            _instance: this,
            _class: this.constructor
        };
    }

}

module.exports = Middleware;