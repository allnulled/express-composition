const express = require("express");
const Controller = require(__dirname + "/Controller.js");

class Router extends Controller {

    static get DEFAULT_OPTIONS() {
        return {
            // method: "use", // this parameter is not configurable
            route: undefined, // string
            middleware: [], // array 
            //-----------------------------------//
            routing: undefined, // function
        }
    }

    onValidate(application) {
        super.onValidate(application);
        if (typeof this.routing !== "function") {
            throw new Error("[Router.onValidate] Required property <routing> as a function type.");
        }
    }

    async onMount(application) {
        try {
            this.onValidate(application);
            await this.onResolveMiddleware(application);
            await this.onController(application); // fulfills this.router asynchronously
            const {route, resolvedMiddleware} = this;
            return application.use(route, resolvedMiddleware, this.router);
        } catch(error) {
            throw error;
        }
    }

    async onRefreshRouter(application) {
        // temporaryRouter is to populate a router with routes
        this.temporaryRouter = express.Router();
        const routingResult = this.routing(this.temporaryRouter, this, application);
        if(routingResult instanceof Promise) {
            await routingResult;
        }
        // innerRouter is the true router we are using under the hood
        this.innerRouter = this.temporaryRouter;
    }
    
    async onController(application) {
        const self = this;
        this.innerRouter = express.Router();
        await this.onRefreshRouter(application);
        // router is a function that redirects the calls
        this.router = function(...args) {
            return self.innerRouter(...args);
        };
    }

    refresh(...args) {
        return this.onRefreshRouter(...args);
    }

}

module.exports = Router;