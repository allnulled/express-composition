const path = require("path");
const Controller = require(__dirname + "/Controller.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");

/**
 * 
 * --------------------
 * 
 * ## `DownloadDirectory`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that, specified a `directory`, it can download its contained files (all the tree down) by a parameter:
 *   - specified in the path of the URL, by default.
 *   - specified as a querystring parameter, which name is defined in the `qsFile`.
 * 
 */
class DownloadDirectory extends Controller {

    /**
     * 
     * -------------------
     * 
     * ### `DownloadDirectory.CONTROLLER_ID`
     * @type `String`
     * @description Identifier name of the current controller.
     */
    static get CONTROLLER_ID() {
        return "DownloadDirectory";
    }

    /**
     * 
     * -------------------
     * 
     * ### `DownloadDirectory.DEFAULT_OPTIONS`
     * @type `Object`
     * @description Properties inherited by default for all controllers of this type.
     * @property 
     * @property - `method:String`. HTTP method used for this controller.
     * @property - `route:String`. URL path reserved for this controller.
     * @property - `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property - `directory:String`. Directory which contains only downloadable files.
     * @property - `options:Object`. Options applied to the downloads of this directory. To see all the options, [here](https://expressjs.com/en/api.html#res.sendFile).
     * @property - `callback:Function`. Function called just after the file was downloaded successfully. It receives a `context:Object`, which contains contextual data.
     * @property - `qsFile:String`. *Optional*. Name of the querystring variable to specify the path of the file to be downloaded.
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            method: "get", // string
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            directory: undefined, // string
            options: undefined, // object
            callback: undefined, // function
            qsFile: undefined, // string
        };
    }

    /**
     * 
     * ----------------
     * 
     * ### `downloadDirectory.constructor`
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
     * ----------------------
     * 
     * ### `downloadDirectory.onMount`
     * @type *Class method. Function.*
     * @parameter
     * @parameter - `application:Object` Application of `express` framework.
     * @returns `void`
     * @asynchronous *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.
     * @description Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.
     * 
     */
    onMount(application) {
        this.onValidate(application);
        const { method, route, middleware } = this;
        if (typeof this.qsFile === "string") {
            return application[method](route, middleware, this.onController());
        } else {
            return application[method](route + "/*", middleware, this.onController());
        }
    }

    /**
     * 
     * ------------------------
     * 
     * ### `downloadDirectory.onError`
     * @type *Class method. Function.*
     * @parameter
     * @parameter - `error:Error`. Error that arised. Not used.
     * @parameter - `context:Object`. Object that contains contextual information.
     * @description Handles response on general errors. By default, it returns a 404 error message in plain text.
     * 
     */
    onError(error, context) {
        return context.response.status(404).send(CommonUtilities.HTTP_RESPONSES.ERROR_404);
    }

    /**
     * 
     * ------------------------
     * 
     * ### `downloadDirectory.onBadRequestError`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `error:Error`. Error that arised.
     * @parameter - `context:Object`. Object that contains contextual information.
     * @returns `void`
     * @description Handles response on bad request error. This method is called when a malicious path is introduced, trying to reach files out of the directory. By default, it returns a 400 error message in plain text.
     * 
     */
    onBadRequestError(error, context) {
        return context.response.status(400).send(CommonUtilities.HTTP_RESPONSES.ERROR_400);
    }

    /**
     * 
     * ----------------------
     * 
     * ### `downloadDirectory.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for the `this.directory` self property to be a string.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if (typeof this.directory !== "string") {
            throw new Error("[DownloadDirectory.onMount] Required property <directory> as a string type.");
        }
    }

    /**
     * 
     * -------------------
     * 
     * ### `downloadDirectory.onCreateContext`
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @parameter - `request:Object`. Request of `express` framework.
     * @parameter - `response:Object`. Response of `express` framework.
     * @parameter - `next:Function`. Typical `next` function of the `express` framework response chain.
     * @returns `context:Object`. Basic context of the current response.
     * @description Returns the basic context of the response.
     * 
     */
    onCreateContext(application, request, response, next) {
        return {
            application,
            request,
            response,
            next,
            _instance: this,
            _class: this.constructor
        };
    }

    /**
     * 
     * -------------------
     * 
     * ### `downloadDirectory.onController`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `controller:Function`. Valid `express` controller function. The returned function must receive `request, response, next` and handle the response adecuately.
     * @description Generates a controller function that will:
     *   - Create a context. Using `this.onCreateContext` method.
     *   - Get the path for a downloadable file. From querystring parameters when the property `qsFile` is a string, or from URL parameters, in the style of `/path/to/file`, by default.
     *   - Throw when the path or the file is not valid.
     *      - If the path was suspiciously bad intentioned, `this.onBadRequestError` is called.
     *      - On other errors, `this.onError` is called.
     *   - Respond with a file download to the request.
     *   - If an error arises, handle the error.
     *   - Otherwise, execute a callback.
     */
    onController(application) {
        // Resolve directory first:
        this.directoryResolved = path.resolve(this.directory);
        if (typeof this.qsFile === "string") {
            return (request, response, next) => {
                const context = this.onCreateContext(application, request, response, next);
                const pathHolder = request.query[this.qsFile];
                const filePath = path.resolve(this.directory, pathHolder);
                if (filePath.startsWith(this.directoryResolved)) {
                    return response.download(filePath, undefined, this.options, error => {
                        if (error) {
                            return this.onError(error, context);
                        }
                        if (typeof this.callback === "function") {
                            return this.callback(context);
                        }
                    });
                } else {
                    return this.onBadRequestError(new Error("[DownloadDirectory] Bad request for file."), context);
                }
            };
        } else {
            return (request, response, next) => {
                const context = this.onCreateContext(application, request, response, next);
                const composedPath = [];
                let paramIndex = 0;
                while (paramIndex in request.params) {
                    composedPath.push(request.params[paramIndex]);
                    paramIndex++;
                }
                const pathHolder = composedPath.join("/");
                const filePath = path.resolve(this.directory, pathHolder);
                if (filePath.startsWith(this.directoryResolved)) {
                    return response.download(filePath, undefined, this.options, error => {
                        if (error) {
                            return this.onError(error, context);
                        }
                        if (typeof this.callback === "function") {
                            return this.callback(context);
                        }
                    });
                } else {
                    return this.onBadRequestError(new Error("[DownloadDirectory] Bad request for file."), context);
                }
            };
        }
    }

}

module.exports = DownloadDirectory;