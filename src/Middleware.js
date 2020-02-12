const Composable = require(__dirname + "/Composable.js");

/**
 * 
 * ------------------
 * 
 * ## `Middleware`
 * @type *Class. Function.*
 * @extends `Composable`
 * @description 
 * 
 */
class Middleware extends Composable {

    /**
     * 
     * ------------------------
     * 
     * ### `Middleware.`
     * @type * *
     * @description 
     * 
     */
    static create(options) {
        return new this(options);
    }

    /**
     * 
     * ------------------------
     * 
     * ### `middleware.`
     * @type * *
     * @description 
     * 
     */
    constructor(options) {
        super(options);
    }

    /**
     * 
     * ------------------------
     * 
     * ### `middleware.`
     * @type * *
     * @description 
     * 
     */
    onMiddleware() {
        return new Promise((ok, fail) => {
            setTimeout(() => {
                return ok(function (request, response, next) {
                    setTimeout(() => {
                        return next();
                    }, 2000);
                });
            }, 2000);
        });
    }

}

module.exports = Middleware;