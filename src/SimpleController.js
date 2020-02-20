const Controller = require(__dirname + "/Controller.js");

/**
 * 
 * ----------------
 * 
 * ## `SimpleController`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that uses a `js` function to directly handle requests.
 * 
 * 
 */
class SimpleController extends Controller {

    /**
     * 
     * ------------------------
     * 
     * ### `SimpleController.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "SimpleController";
    }

    /**
     * 
     * ------------------------
     * 
     * ### `SimpleController.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property `method:String`. HTTP method used for this controller.
     * @property `route:String`. URL path reserved for this controller.
     * @property `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property `function:Function`. Function used as `express` controller function, but also contextualized.
     * @property `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            method: "get", // string
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            function: undefined, // function
            silentMode: true // boolean
        };
    }

    /**
     * 
     * ------------------------
     * 
     * ### `SimpleController.constructor`
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
     * ### `SimpleController.onMount`
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
            const {method, route, resolvedMiddleware} = this;
            return application[method](route, resolvedMiddleware, this.onController());
        } catch(error) {
            throw error;
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `SimpleController.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for `this.function` to be a function.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if(typeof this.function !== "function") {
            throw new Error("[SimpleController.onMount] Required property <function> as a function type.");
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `SimpleController.onController`
     * @type *Static class*
     * @parameter 
     * @parameter - `application:Object`. Application of the `express` framework.
     * @returns `controller:Function`. An `express` controller function.
     * @description Generates a controller function that calls the passed `this.function` as controller.
     * 
     */
    onController(application) {
        return (request, response, next) => {
            const context = {
                application,
                request,
                response,
                next,
                _instance: this,
                _class: this.constructor,
            };
            return this.function.call(this, context, request, response, next);
        };
    }

}

module.exports = SimpleController;