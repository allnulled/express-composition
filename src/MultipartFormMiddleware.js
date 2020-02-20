const multer  = require("multer");
const Middleware = require(__dirname + "/Middleware.js");

class MultipartFormMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "MultipartFormMiddleware";
    }

    static get DEFAULT_OPTIONS() {
        return {
            options: {},
            method: "any",
            parameters: [],
        };
    }

    static get Framework() {
        return multer;
    }

    constructor(options = {}) {
        super(options);
    }

    onValidate(controller, application) {
        const availableMethods = ["single", "array", "fields", "none", "any"];
        if(availableMethods.indexOf(this.method) === -1) {
            throw new Error("[MultipartFormMiddleware.onValidate] Required property <method> to be one of: '" + availableMethods.join("' | '") + "'.");
        }
        if(typeof this.options !== "object") {
            throw new Error("[MultipartFormMiddleware.onValidate] Required property <options> to be a type of object.");
        }
        if(typeof this.parameters !== "object") {
            throw new Error("[MultipartFormMiddleware.onValidate] Required property <parameters> to be a type of object.");
        }
    }

    onResolve(controller, application) {
        this.onValidate(controller, application);
        return multer(this.options)[this.method]([].concat(this.parameters));
    }

}

module.exports = MultipartFormMiddleware;