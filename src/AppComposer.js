const Controller = require(__dirname + "/Controller.js");
const Composable = require(__dirname + "/Composable.js");

/**
 * 
 * ----------------------
 * 
 * ## `AppComposer`
 * @type *Class. Function.*
 * @extends `Composable`
 * @description Useful to compose `express` applications from `express-composition` controllers.
 * 
 */
class AppComposer extends Composable {

    /**
     * 
     * ----------------------------
     * 
     * ### `AppComposer.compose`
     * @type *Static class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application object from `express` framework.
     * @parameter - `controllers:Array<Object>`. List of `Controller` objects from `express-composition` framework.
     * @returns `application:Promise<Object>`. Asynchronously, the `express` application already composed, with all `express-composition` controllers attached.
     * @description Creates an `AppComposer` object, and returns the `appComposer.compose` method result.
     */
    static compose(application, controllers) {
        const appComposer = new this();
        return appComposer.compose(application, controllers);
    }

    /**
     * 
     * ------------------------------
     * 
     * ### `appComposer.constructor`
     * @type *Class constructor. Function.*
     * @parameter
     * @parameter - `Object:options`. Properties and methods that should be implemented by the instances that this class produces.
     * @description Creates an `AppComposer` instance.
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * 
     * -------------------------------
     * 
     * ### `appComposer.compose`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework into which the controllers will be mounted.
     * @parameter - `controllers:Array<Controller>`. List of `express-composition` controllers to be mounted into an `express` application.
     * @returns `Promise<Object>`. Asynchronously, the `express` application with all the `express-composition` controllers mounted on it.
     * @description Composes and returns asynchronously an `express` application from `express-composition` controllers.
     */
    async compose(application, controllers) {
        try {
            for (let index = 0; index < controllers.length; index++) {
                if (!(controllers[index] instanceof Controller)) {
                    throw new Error("[express-composition][AppComposer.compose] Argument 2 must be an array of express-composition.Controller instances, but item " + index + " is not (" + typeof controllers[index] + ")");
                } else {
                    const mountingResult = controllers[index].onMount(application);
                    if (mountingResult instanceof Promise) {
                        await mountingResult;
                    }
                }
            }
            return application;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AppComposer;