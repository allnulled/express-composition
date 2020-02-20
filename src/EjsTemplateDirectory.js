const ejs = require("ejs");
const path = require("path");
const Controller = require(__dirname + "/Controller.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");

/**
 * 
 * -----------------
 * 
 * ## `EjsTemplateDirectory`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that is able to render a specific [`ejs`](https://www.npmjs.com/package/ejs) template file which is placed inside a specific directory. The request must provide its path.
 * 
 */
class EjsTemplateDirectory extends Controller {

    /**
     * 
     * -----------------
     * 
     * ### `EjsTemplateDirectory.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "EjsTemplateDirectory";
    }

    /**
     * 
     * -----------------
     * 
     * ### `EjsTemplateDirectory.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property 
     * @property - `method:String`. HTTP method used for this controller.
     * @property - `route:String`. URL path reserved for this controller.
     * @property - `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property - `directory:String`. Directory containing valid `ejs` files.
     * @property - `options:Object`. Options applied to the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).
     * @property - `qsFile:String`. Variable of the querystring parameters used to find the path of the `ejs` file to render. When omitted, this parameter is provided as (nesteable) URL parameters. Defaults to `undefined`.
     * 
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
            qsFile: undefined, // string
        };
    }

    /**
     * 
     * -----------------
     * 
     * ### `ejsTemplateDirectory.constructor`
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
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onMount`
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
            if (typeof this.qsFile === "string") {
                return application[method](route, resolvedMiddleware, this.onController());
            } else {
                return application[method](route + "/*", resolvedMiddleware, this.onController());
            }
        } catch(error) {
            throw error;
        }
    }

    /**
     * 
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onError`
     * @type *Class method. Function.*
     * @parameter `error:Error`. Error that arised. Not used.
     * @parameter `context:Object`. Object that contains contextual information.
     * @description Handles response on general errors. By default, it returns a 404 error message in plain text.
     * 
     */
    onError(error, context) {
        return context.response.status(404).send(CommonUtilities.HTTP_RESPONSES.ERROR_404);
    }

    /**
     * 
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onBadRequestError`
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
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for `this.templateFile` or `this.templateFile` properties to exist.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if (typeof this.directory !== "string") {
            throw new Error("[EjsTemplateDirectory.onMount] Required property <directory> as a string type.");
        }
    }

    /**
     * 
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onCreateContext`
     * @type *Class method. Function.*
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
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onRenderFile`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `file:String`. Path of the `ejs` template file to render.
     * @parameter - `parameters:Object`. Path of the `ejs` template file to render.
     * @parameter - `options:Object`. Properties passed as options of the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).
     * @returns `contents:Promise<String>`. Returns, asynchronously, the contents of the result of the rendered `file`, with the provided `parameters` and `options`.
     * @throws `error:Error`. The returned `Promise` can throw an error if there are problems while finding the file or rendering its contents.
     * @description Renders an `ejs` template file, and returns the result asynchronously.
     * 
     */
    onRenderFile(file, parameters, options) {
        return new Promise((ok, fail) => {
            return ejs.renderFile(file, parameters, options, (error, contents) => {
                if (error) {
                    return fail(error);
                }
                return ok(contents);
            })
        });
    }

    /**
     * 
     * -----------------
     * 
     * ### `ejsTemplateDirectory.onController`
     * @type *Static class*
     * @parameter 
     * @parameter - `application:Object`. Application of the `express` framework.
     * @returns `controller:Function`. An `express` controller function.
     * @description Generates a controller function that finds the `ejs` template file (from URL or querystring parameters) placed inside a directory, renders it, and responds with its result.
     * 
     */
    onController(application) {
        // Resolve directory first:
        this.directoryResolved = path.resolve(this.directory);
        if (typeof this.qsFile === "string") {
            return (request, response, next) => {
                const pathHolder = request.query[this.qsFile];
                const filePath = path.resolve(this.directory, pathHolder).replace(/\.ejs/gi, "") + ".ejs";
                const context = this.onCreateContext(application, request, response, next, {
                    _templateFile: filePath,
                    _templateRequested: pathHolder,
                    _templatesDirectory: this.directoryResolved,
                });
                if (filePath.startsWith(this.directoryResolved)) {
                    return this.onRenderFile(filePath, context, this.options).then(result => {
                        return response.status(200).send(result);
                    }).catch(error => {
                        return this.onError(error, context);
                    });
                } else {
                    return this.onBadRequestError(new Error("[EjsTemplateDirectory] Bad request for file."), context);
                }
            };
        } else {
            return (request, response, next) => {
                const composedPath = [];
                let paramIndex = 0;
                while (paramIndex in request.params) {
                    composedPath.push(request.params[paramIndex]);
                    paramIndex++;
                }
                const pathHolder = composedPath.join("/");
                const filePath = path.resolve(this.directory, pathHolder).replace(/\.ejs/gi, "") + ".ejs";
                const context = this.onCreateContext(application, request, response, next, {
                    _templateFile: filePath,
                    _templateRequested: pathHolder,
                    _templatesDirectory: this.directoryResolved,
                });
                if (filePath.startsWith(this.directoryResolved)) {
                    return this.onRenderFile(filePath, context, this.options).then(result => {
                        return response.status(200).send(result);
                    }).catch(error => {
                        return this.onError(error, context);
                    });
                } else {
                    return this.onBadRequestError(new Error("[EjsTemplateDirectory] Bad request for file."), context);
                }
            };
        }
    }

}

module.exports = EjsTemplateDirectory;