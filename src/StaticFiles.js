const express = require("express");
const Controller = require(__dirname + "/Controller.js");

/**
 * 
 * -----------------
 * 
 * ## `StaticFiles`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that uses `express`'s [static middleware](https://expressjs.com/en/api.html#express.static).
 * 
 */
class StaticFiles extends Controller {

    /**
     * 
     * ------------------------
     * 
     * ### `StaticFiles.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "StaticFiles";
    }

    /**
     * 
     * ------------------------
     * 
     * ### `StaticFiles.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property `route:String`. URL path reserved for this controller.
     * @property `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property `file:String`. File containing a `js` module used as `express` controller function, or factory.
     * @property `cache:Boolean`. Whether or not the `js` module should be cached. When not cached, take into account that the registry of the `require` function is modified, and it can affect other parts of your project. By default, `true`.
     * @property `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            // method: "use", // No <method> in this controller (GET & HEAD only).
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            path: undefined, // string
            options: {}, // object
        };
    }

    /**
     * 
     * ------------------------
     * 
     * ### `staticFiles.constructor`
     * @type *Class constructor. Function.*
     * @parameter
     * @parameter - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.
     * @description It only calls to the parent's constructor, passing the received `options:Object`.
     * 
     */
    constructor(options) {
        super(options);
    }

    /**
     * 
     * ------------------------
     * 
     * ### `staticFiles.onMount`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object` Application of `express` framework.
     * @returns `void`
     * @asynchronous *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.
     * @description Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.
     * 
     */
    async onMount(application) {
        try {
            this.onValidate(application);
            await this.onResolveMiddleware(application);
            const {route, resolvedMiddleware} = this;
            return application.use(route, resolvedMiddleware, this.onController());
        } catch(error) {
            throw error;
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `staticFiles.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for `this.path` to be a string.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if(typeof this.path !== "string") {
            throw new Error("[StaticFiles.onMount] Required property <path> as a string type.");
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `staticFiles.onController`
     * @type *Static class*
     * @parameter 
     * @parameter - `application:Object`. Application of the `express` framework.
     * @returns `controller:Function`. An `express` controller function.
     * @description Returns the result of using `express.static` with `this.path` and `this.options` properties.
     * 
     */
    onController(application) {
        return express.static(this.path, this.options);
    }

}

module.exports = StaticFiles;