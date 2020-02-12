const Middleware = require(__dirname + "/../Middleware.js");

class MySqlQueryMiddleware extends Middleware {

    static get MIDDLEWARE_ID() {
        return "MySqlQueryMiddleware";
    }

    static get DEFAULT_OPTIONS() {
        return {
            connection: undefined, // object
            query: undefined, // object
            silentMode: true // boolean
        };
    }

    constructor(options) {
        super(options);
    }

}

module.exports = MySqlQueryMiddleware;