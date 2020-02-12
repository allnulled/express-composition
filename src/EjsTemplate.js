const ejs = require("ejs");
const Controller = require(__dirname + "/Controller.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");

/**
 * 
 * ----------------
 * 
 * ## `EjsTemplate`
 * @type *Class. Function.*
 * @extends `Controller`
 * @description Represents a controller that is able to render a specific [`ejs`](https://www.npmjs.com/package/ejs) template file.
 * 
 */
class EjsTemplate extends Controller {

    /**
     * 
     * --------------
     * 
     * ### `EjsTemplate.CONTROLLER_ID`
     * @type *Static class property. String.*
     * @description Identifier name of the current controller.
     * 
     */
    static get CONTROLLER_ID() {
        return "EjsTemplate";
    }

    /**
     * 
     * --------------
     * 
     * ### `EjsTemplate.DEFAULT_OPTIONS`
     * @type *Static class property. Object.*
     * @description Default properties and methods that the class assigns to its instances by default.
     * @property 
     * @property - `method:String`. HTTP method used for this controller.
     * @property - `route:String`. URL path reserved for this controller.
     * @property - `middleware:Array<Function>`. Middlewares applied to this controller.
     * @property - `templateFile:String`. File used as `ejs` template. This has priority over the `template` property.
     * @property - `template:String`. Template contents, as string. When `templateFile` is specified, this property is ignored.
     * @property - `parameters:Object`. Parameters that are passed, directly, to the template.
     * @property - `options:Object`. Options applied to the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).
     * @property - `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {
            method: "get", // string
            route: undefined, // string
            middleware: [], // array
            //---------------------------------//
            templateFile: undefined, // string
            template: undefined, // function | string
            parameters: {}, // function | object
            options: {}, // object,
            silentMode: true // boolean
        };
    }

    /**
     * 
     * --------------
     * 
     * ### `ejsTemplate.constructor`
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
     * --------------
     * 
     * ### `ejsTemplate.onMount`
     * @type *Class method. Function.*
     * @parameter `application:Object` Application of `express` framework.
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
     * --------------
     * 
     * ### `ejsTemplate.onError`
     * @type *Class method. Function.*
     * @parameter `error:Error`. Error that arised. Not used.
     * @parameter `context:Object`. Object that contains contextual information.
     * @description Handles response on general errors. By default, it returns a 404 error message in plain text.
     * 
     */
    onError(error, parameters) {
        if(!this.silentMode) {
            console.log("[EjsTemplate.onError] Error arised:", error);
        }
        return parameters.response.status(500).send(CommonUtilities.HTTP_RESPONSES.ERROR_500);
    }

    /**
     * 
     * --------------
     * 
     * ### `ejsTemplate.onValidate`
     * @type *Class method. Function.*
     * @parameter `application:Object`. Application of `express` framework.
     * @returns `void`
     * @throws `Error`. Error thrown by any validation.
     * @description Calls to the `onValidate` method of the parent, and also checks for `this.templateFile` or `this.templateFile` properties to exist.
     * 
     */
    onValidate(application) {
        super.onValidate(application);
        if((!(this.templateFile)) && (!(this.template))) {
            throw new Error("[EjsTemplate.onMount] Required property <templateFile>-or-<template> is not defined.");
        }
    }

    /**
     * 
     * --------------
     * 
     * ### `ejsTemplate.onResponse`
     * @type *Class method. Function.*
     * @parameter `output:String`. Message to respond.
     * @parameter `context:Object`. Context of the response.
     * @description Responds the request.
     * 
     */
    onResponse(output, context) {
        return context.response.status(200).send(output);
    }

    /**
     * 
     * --------------
     * 
     * ### `ejsTemplate.onController`
     * @type *Class method. Function.*
     * @parameter `application:Object`. Application of the `express` framework.
     * @returns `controller:Function`. An `express` controller function.
     * @description Generates and returns an `express` controller function that will render a specific `ejs` (text or file) template.
     * 
     */
    onController(application) {
        const {templateFile, template, parameters, options} = this;
        return (request, response, next) => {
            const context = {
                application,
                request,
                response,
                next,
                require,
                _instance: this,
                _class: this.constructor,
                ...parameters
            };
            if(templateFile) {
                ejs.renderFile(templateFile, Object.assign(context, {templateFile}), options, (error, contents) => {
                    if(error) {
                        return this.onError(error, context);
                    }
                    return this.onResponse(contents, context);
                });
            } else /*if(template)*/ {
                try {
                    const contents = ejs.render(template, Object.assign(context, {template}), options);
                    return this.onResponse(contents, context);
                } catch(error) {
                    return this.onError(error, context);
                }
            }
        };
    }

}

module.exports = EjsTemplate;