const bodyParser  = require("body-parser");
const Middleware = require(__dirname + "/Middleware.js");

class BodyParserMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "BodyParserMiddleware";
    }

    static get DEFAULT_OPTIONS() {
        return {
            method: undefined,
            options: {}
        };
    }

    onValidate(controller, application) {
        const availableMethods = ["json", "raw", "text", "urlencoded"];
        if(availableMethods.indexOf(this.method) === -1) {
            throw new Error("[BodyParserMiddleware.onValidate] Required property <method> to be one of: '" + availableMethods.join("' | '") + "'.");
        }
        if(typeof this.options !== "object") {
            throw new Error("[BodyParserMiddleware.onValidate] Required property <options> to be a type of object.");
        }
    }

    constructor(options = {}) {
        super(options);
    }

    onResolve(controller, application) {
        this.onValidate(controller, application);
        return bodyParser[this.method](this.options);
    }

}

module.exports = BodyParserMiddleware;