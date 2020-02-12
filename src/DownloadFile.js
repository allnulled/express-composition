const Controller = require(__dirname + "/Controller.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");

/**
 * 
 * ----------------
 * 
 * ## `DownloadFile`
 * @type *Class. Function.*
 * @description Represents a controller that downloads a specified file.
 * 
 */
class DownloadFile extends Controller {

    /**
     * 
     * ----------------
     * 
     * ### `DownloadFile.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "DownloadFile";
    }

    /**
     * 
     * -----------------
     * 
     * ### `DownloadFile.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property 
     * @property - `method:String`. HTTP method used for this controller.
     * @property - `route:String`. URL path reserved for this controller.
     * @property - `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property - `file:String`. File which is downloaded by the controller.
     * @property - `filename:String`. Name of the file for the user's download.
     * @property - `options:Object`. Options applied to the download of this file. To see all the options, [here](https://expressjs.com/en/api.html#res.sendFile).
     * @property - `callback:Function`. Function called just after the file was downloaded successfully. It receives a `context:Object`, which contains contextual data.
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            method: "get", // string
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            file: undefined, // string
            filename: undefined, // string, optional
            options: undefined, // object
            callback: undefined, // function
        };
    }

    /**
     * 
     * --------------------
     * 
     * ### `downloadFile.constructor`
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
     * --------------------
     * 
     * ### `downloadFile.onMount`
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
        const {method, route, middleware} = this;
        return application[method](route, middleware, this.onController());
    }

    /**
     * 
     * ------------------------
     * 
     * ### `downloadFile.onError`
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
     * ----------------------
     * 
     * ### `downloadFile.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for the `this.file` self property to be a string.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if(typeof this.file !== "string") {
            throw new Error("[DownloadFile.onMount] Required property <file> as a string type.");
        }
    }

    /**
     * 
     * -------------------
     * 
     * ### `downloadFile.onController`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `controller:Function`. Valid `express` controller function. The returned function must receive `request, response, next` and handle the response adecuately.
     * @description Generates a controller function that will:
     *   - Create a context.
     *   - Download the file specified at `this.file` property:
     *      - With the name provided at `this.filename`.
     *      - With the options provided at `this.options`.
     *   - Handle any error calling `this.onError` method.
     *   - Call, on successfull operations, to the `this.callback` property.
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
            }
            return response.download(this.file, this.filename, this.options, error => {
                if(error) {
                    return this.onError(error, context);
                }
                if(typeof this.callback === "function") {
                    return this.callback(context);
                }
            });
        };
    }

}

module.exports = DownloadFile;