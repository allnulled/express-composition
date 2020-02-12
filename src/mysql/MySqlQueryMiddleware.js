const Middleware = require(__dirname + "/../Middleware.js");

class MySqlQuery extends Middleware {

    static get MIDDLEWARE_ID() {
        return "MySqlQuery";
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

module.exports = MySqlQuery;