/**
 * 
 * ------------------
 * 
 * ## `Composable`
 * @type *Class. Function.*
 * @description Class to provide an easy, fast and standard way to extend classes.
 * 
 */
class Composable {
    
    /**
     * 
     * --------------------
     * 
     * ### `Composable.DEFAULT_OPTIONS`
     * 
     * @type `Static class property. Object.`
     * @description Holds the common values that will override properties and methods of each instance, by default. It is an empty object by default.
     * 
     */
    static get DEFAULT_OPTIONS() {
        return {};
    }

    /**
     * 
     * --------------------
     * 
     * ### `Composable.create`
     * @type `Static class method. Function.`
     * @returns `composable:Object`
     * @description Returns a new instance of the class. This static method is mainly to avoid using the `new` keyword in our code. It passes the same arguments of the `create` to the `constructor`, and returns the created instance.
     * 
     */
    static create(...args) {
        return new this(...args);
    }

    /**
     * 
     * -------------------.
     * 
     * ### `composable.constructor`
     * @type `Class constructor. Function.`
     * @parameter 
     * @parameter - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.
     * @description Overrides properties and methods of current instance by, in this order:
     *   - `this.constructor.DEFAULT_OPTIONS:Object`. The static property.
     *   - `options:Object`. The received object.
     * 
     */
    constructor(options = {}) {
        Object.assign(this, this.constructor.DEFAULT_OPTIONS, options);
    }

}

module.exports = Composable;