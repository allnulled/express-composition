const Composable = require(__dirname + "/Composable.js");
const Middleware = require(__dirname + "/Middleware.js");

/**
 * 
 * -----------------
 * 
 * ## `Controller`
 * @type *Class. Function.*
 * @extends `Composable`
 * @description 
 * 
 */
class Controller extends Composable {

    /**
     * 
     * ------------------
     * 
     * ### `controller.onValidateApplication`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application from `express` framework.
     * @returns `void`
     * @throws `Error`. When `application` parameter is not defined.
     * @description Checks that there is an application passed to `controller.onMount` method.
     */
    onValidateApplication(application) {
        if(!application) {
            throw new Error("[" + this.constructor.CONTROLLER_ID + ".onMount] Required parameter <application:1> is not defined.");
        }
    }

    /**
     * 
     * -----------------
     * 
     * ### `controller.onValidateRoute`
     * @type *Class method. Function.*
     * @returns `void`
     * @throws `Error`. When `controller.route` is not defined.
     * @description Checks that the property `route` of this instance is defined.
     * 
     */
    onValidateRoute() {
        if(!(this.route)) {
            throw new Error("[" + this.constructor.CONTROLLER_ID + ".onMount] Required property <route> is not defined.");
        }
    }

    /**
     * 
     * ------------------
     * 
     * ### `controller.onValidate`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application from `express` framework.
     * @returns `void`
     * @description Calls to `controller.onValidateApplication` and `controller.onValidateRoute`.
     */
    onValidate(application) {
        this.onValidateApplication(application);
        this.onValidateRoute();
    }

    /**
     * 
     * ------------------
     * 
     * ### `controller.onMount`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application from `express` framework.
     * @returns `void`
     * @throws `Error`. This method must be overriden by its successor.
     * @description This method, when overriden (it must be overriden), should mount the controller, the `router` property and the `middleware` property into the `application`.
     * 
     */
    onMount(application) {
        throw new Error("[express-composition][Controller.onMount] Method <onMount> must be overriden.");
    }

    async onResolveMiddleware(application) {
        this.resolvedMiddleware = [];
        const middlewares = [].concat(this.middleware);
        for(let index = 0; index < middlewares.length; index++) {
            const middleware = middlewares[index];
            if(middleware instanceof Middleware) {
                const result = middleware.onResolve(this, application);
                let resolved = result;
                if(result instanceof Promise) {
                    resolved = await result;
                }
                this.resolvedMiddleware.push(resolved);
            } else {
                this.resolvedMiddleware.push(middleware);
            }
        }
    }

}

module.exports = Controller;