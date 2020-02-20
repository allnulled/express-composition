const importFresh = require("import-fresh");
const Controller = require(__dirname + "/Controller.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");

/**
 * 
 * ---------------------------
 * 
 * ## `FileController`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that uses a `js` file (which must export an `express` controller function) for responding requests. The `js` file can be cached (behaviour by default), or uncached.
 * When uncached, the file is converted automatically to a `factory` pattern to generate random controllers.
 * 
 */
class FileController extends Controller {

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "FileController";
    }

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property `method:String`. HTTP method used for this controller.
     * @property `route:String`. URL path reserved for this controller.
     * @property `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property `file:String`. File containing a `js` module used as `express` controller function, or factory.
     * @property `cache:Boolean`. Whether or not the `js` module should be cached. When not cached, take into account that the registry of the `require` function is modified, and it can affect other parts of your project. By default, `true`.
     * @property `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            method: "get", // string
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            file: undefined, // string
            cache: true, // boolean
            silentMode: true // boolean
        };
    }

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.constructor`
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
     * ### `FileController.onMount`
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
            const { method, route, resolvedMiddleware } = this;
            return application[method](route, resolvedMiddleware, this.onController());
        } catch(error) {
            throw error;
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.onError`
     * @type *Class method. Function.*
     * @parameter `error:Error`. Error that arised. Not used.
     * @parameter `context:Object`. Object that contains contextual information.
     * @description Handles response on general errors. By default, it returns a 404 error message in plain text.
     * 
     */
    onError(error, context) {
        if (!this.silentMode) {
            console.log("[FileController.onError] Error arised:", error);
        }
        return context.response.status(500).send(CommonUtilities.HTTP_RESPONSES.ERROR_500);
    }

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for `this.file` to be a string.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if (typeof this.file !== "string") {
            throw new Error("[FileController.onMount] Required property <file> as a string type.");
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `FileController.onController`
     * @type *Static class*
     * @parameter 
     * @parameter - `application:Object`. Application of the `express` framework.
     * @returns `controller:Function`. An `express` controller function.
     * @description Generates a controller function that imports (caching or not) a `js` file that must export a callback that receives:
     *   - `context:Object`: contextual information.
     *   - `request:Object`: an `express` `Request` object.
     *   - `response:Object`: an `express` `Response` object.
     *   - `next:Function`: an `express` `next` function.
     * The `js` file, when not cached, will be freshly imported in each request.
     * On errors, the method `this.onError` will be called in order to handle the erroneous request.
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
                _class: this.constructor
            };
            if (this.cache) {
                try {
                    return require(this.file).call(this, context, request, response, next);
                } catch (error) {
                    return this.onError(error, context);
                }
            } else {
                try {
                    return importFresh(this.file).call(this, context, request, response, next);
                } catch (error) {
                    return this.onError(error, context);
                }
            };
        }
    };
}

module.exports = FileController;