
----------------------

## `AppComposer`


**Type**:  *Class. Function.*


**Extends**:  `Composable`


**Description**:  Useful to compose `express` applications from `express-composition` controllers.




----------------------------

### `AppComposer.compose`


**Type**:  *Static class method. Function.*


**Parameter**:  


 - `application:Object`. Application object from `express` framework.


 - `controllers:Array<Object>`. List of `Controller` objects from `express-composition` framework.


**Returns**:  `application:Promise<Object>`. Asynchronously, the `express` application already composed, with all `express-composition` controllers attached.


**Description**:  Creates an `AppComposer` object, and returns the `appComposer.compose` method result.



------------------------------

### `appComposer.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `Object:options`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  Creates an `AppComposer` instance.



-------------------------------

### `appComposer.compose`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework into which the controllers will be mounted.


 - `controllers:Array<Controller>`. List of `express-composition` controllers to be mounted into an `express` application.


**Returns**:  `Promise<Object>`. Asynchronously, the `express` application with all the `express-composition` controllers mounted on it.


**Description**:  Composes and returns asynchronously an `express` application from `express-composition` controllers.



----------------------

## `CommonUtilities`


**Type**:  *Class. Function.*


**Description**:  Set of common utilities that can be used across all the `express-composition` framework.




--------------------

### `CommonUtilities.HTTP_RESPONSES`


**Name**:  `CommonUtilities.HTTP_RESPONSES`


**Type**:  *Static class property. Object.*


**Description**:  Object that holds the strings used as prototypical HTTP responses.


**Property**: 


 - **ERROR_400**: `HTTP 400 error: Bad Request`


 - **ERROR_401**: `HTTP 401 error: Unauthorized`


 - **ERROR_403**: `HTTP 403 error: Forbidden`


 - **ERROR_404**: `HTTP 404 error: Not Found`


 - **ERROR_405**: `HTTP 405 error: Method Not Allowed`


 - **ERROR_409**: `HTTP 409 error: Conflict`


 - **ERROR_500**: `HTTP 500 error: Internal Server Error`


 - **ERROR_503**: `HTTP 503 error: Service Unavailable`



------------------

## `Composable`


**Type**:  *Class. Function.*


**Description**:  Class to provide an easy, fast and standard way to extend classes.




--------------------

### `Composable.DEFAULT_OPTIONS`



**Type**:  `Static class property. Object.`


**Description**:  Holds the common values that will override properties and methods of each instance, by default. It is an empty object by default.




--------------------

### `Composable.create`


**Type**:  `Static class method. Function.`


**Returns**:  `composable:Object`


**Description**:  Returns a new instance of the class. This static method is mainly to avoid using the `new` keyword in our code. It passes the same arguments of the `create` to the `constructor`, and returns the created instance.




-------------------.

### `composable.constructor`


**Type**:  `Class constructor. Function.`


**Parameter**:  


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  Overrides properties and methods of current instance by, in this order:
  - `this.constructor.DEFAULT_OPTIONS:Object`. The static property.
  - `options:Object`. The received object.




----------------

## `DownloadFile`


**Type**:  *Class. Function.*


**Description**:  Represents a controller that downloads a specified file.




----------------

### `DownloadFile.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




-----------------

### `DownloadFile.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  


 - `method:String`. HTTP method used for this controller.


 - `route:String`. URL path reserved for this controller.


 - `middleware:Array<Function>`. Middlewares applied to this controller.


 - `file:String`. File which is downloaded by the controller.


 - `filename:String`. Name of the file for the user's download.


 - `options:Object`. Options applied to the download of this file. To see all the options, [here](https://expressjs.com/en/api.html#res.sendFile).


 - `callback:Function`. Function called just after the file was downloaded successfully. It receives a `context:Object`, which contains contextual data.




--------------------

### `downloadFile.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**:  


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




--------------------

### `downloadFile.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




------------------------

### `downloadFile.onError`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `error:Error`. Error that arised. Not used.


 - `context:Object`. Object that contains contextual information.


**Description**:  Handles response on general errors. By default, it returns a 404 error message in plain text.




----------------------

### `downloadFile.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for the `this.file` self property to be a string.




-------------------

### `downloadFile.onController`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `controller:Function`. Valid `express` controller function. The returned function must receive `request, response, next` and handle the response adecuately.


**Description**:  Generates a controller function that will:
  - Create a context.
  - Download the file specified at `this.file` property:
     - With the name provided at `this.filename`.
     - With the options provided at `this.options`.
  - Handle any error calling `this.onError` method.
  - Call, on successfull operations, to the `this.callback` property.




-----------------

## `Controller`


**Type**:  *Class. Function.*


**Extends**:  `Composable`


**Description**:  




------------------

### `controller.onValidateApplication`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application from `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. When `application` parameter is not defined.


**Description**:  Checks that there is an application passed to `controller.onMount` method.



-----------------

### `controller.onValidateRoute`


**Type**:  *Class method. Function.*


**Returns**:  `void`


**Throws**:  `Error`. When `controller.route` is not defined.


**Description**:  Checks that the property `route` of this instance is defined.




------------------

### `controller.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application from `express` framework.


**Returns**:  `void`


**Description**:  Calls to `controller.onValidateApplication` and `controller.onValidateRoute`.



------------------

### `controller.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application from `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. This method must be overriden by its successor.


**Description**:  This method, when overriden (it must be overriden), should mount the controller, the `router` property and the `middleware` property into the `application`.




----------------

## `EjsTemplate`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that is able to render a specific [`ejs`](https://www.npmjs.com/package/ejs) template file.




--------------

### `EjsTemplate.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




--------------

### `EjsTemplate.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  


 - `method:String`. HTTP method used for this controller.


 - `route:String`. URL path reserved for this controller.


 - `middleware:Array<Function>`. Middlewares applied to this controller.


 - `templateFile:String`. File used as `ejs` template. This has priority over the `template` property.


 - `template:String`. Template contents, as string. When `templateFile` is specified, this property is ignored.


 - `parameters:Object`. Parameters that are passed, directly, to the template.


 - `options:Object`. Options applied to the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).


 - `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).




--------------

### `ejsTemplate.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**:  


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




--------------

### `ejsTemplate.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




--------------

### `ejsTemplate.onError`


**Type**:  *Class method. Function.*


**Parameter**:  `error:Error`. Error that arised. Not used.


 `context:Object`. Object that contains contextual information.


**Description**:  Handles response on general errors. By default, it returns a 404 error message in plain text.




--------------

### `ejsTemplate.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for `this.templateFile` or `this.templateFile` properties to exist.




--------------

### `ejsTemplate.onResponse`


**Type**:  *Class method. Function.*


**Parameter**:  `output:String`. Message to respond.


 `context:Object`. Context of the response.


**Description**:  Responds the request.




--------------

### `ejsTemplate.onController`


**Type**:  *Class method. Function.*


**Parameter**:  `application:Object`. Application of the `express` framework.


**Returns**:  `controller:Function`. An `express` controller function.


**Description**:  Generates and returns an `express` controller function that will render a specific `ejs` (text or file) template.




---------------------------

## `JsFile`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that uses a `js` file (which must export an `express` controller function) for responding requests. The `js` file can be cached (behaviour by default), or uncached.
When uncached, the file is converted automatically to a `factory` pattern to generate random controllers.




------------------------

### `JsFile.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




------------------------

### `JsFile.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  `method:String`. HTTP method used for this controller.


 `route:String`. URL path reserved for this controller.


 `middleware:Array<Function>`. Middlewares applied to this controller.


 `file:String`. File containing a `js` module used as `express` controller function, or factory.


 `cache:Boolean`. Whether or not the `js` module should be cached. When not cached, take into account that the registry of the `require` function is modified, and it can affect other parts of your project. By default, `true`.


 `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).




------------------------

### `JsFile.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




------------------------

### `JsFile.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




------------------------

### `JsFile.onError`


**Type**:  *Class method. Function.*


**Parameter**:  `error:Error`. Error that arised. Not used.


 `context:Object`. Object that contains contextual information.


**Description**:  Handles response on general errors. By default, it returns a 404 error message in plain text.




------------------------

### `JsFile.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for `this.file` to be a string.




------------------------

### `JsFile.onController`


**Type**:  *Static class*


**Parameter**:  


 - `application:Object`. Application of the `express` framework.


**Returns**:  `controller:Function`. An `express` controller function.


**Description**:  Generates a controller function that imports (caching or not) a `js` file that must export a callback that receives:
  - `context:Object`: contextual information.
  - `request:Object`: an `express` `Request` object.
  - `response:Object`: an `express` `Response` object.
  - `next:Function`: an `express` `next` function.
The `js` file, when not cached, will be freshly imported in each request.
On errors, the method `this.onError` will be called in order to handle the erroneous request.




----------------

## `JsFunction`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that uses a `js` function to directly handle requests.





------------------------

### `JsFunction.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




------------------------

### `JsFunction.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  `method:String`. HTTP method used for this controller.


 `route:String`. URL path reserved for this controller.


 `middleware:Array<Function>`. Middlewares applied to this controller.


 `function:Function`. Function used as `express` controller function, but also contextualized.


 `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).




------------------------

### `jsFunction.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




------------------------

### `jsFunction.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




------------------------

### `jsFunction.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for `this.function` to be a function.




------------------------

### `jsFunction.onController`


**Type**:  *Static class*


**Parameter**:  


 - `application:Object`. Application of the `express` framework.


**Returns**:  `controller:Function`. An `express` controller function.


**Description**:  Generates a controller function that calls the passed `this.function` as controller.




------------------

## `src/index.js` **(`package.json#main`)**


**Type**:  *Object.*


**Description**:  The object returned by `require("express-composition")`.


**Property**:  


 - `AppComposer:Class`. Class used to compose `express` applications using `express-composition` controllers.


 - `Composable:Class`. Utility class.


 - `Controller:Class`. Utility class.


 - `DownloadFile:Class`. Type of `express-composition` controller. It [downloads](https://expressjs.com/en/api.html#res.download) one specific file.


 - `DownloadDirectory:Class`. Type of `express-composition` controller. It lets the user [download](https://expressjs.com/en/api.html#res.download) files placed inside a directory, specifying the path of the file.


 - `EjsTemplate:Class`. Type of `express-composition` controller. It renders a specific [`ejs`](https://www.npmjs.com/package/ejs) template file.


 - `EjsTemplateDirectory:Class`. Type of `express-composition` controller. It lets the user render [`ejs`](https://www.npmjs.com/package/ejs) template files placed inside a directory, specifying the path of the file.


 - `JsFile:Class`. Type of `express-composition` controller. It uses a `js` file that exports a simple `express` controller function as the response handler.


 - `JsFunction:Class`. Type of `express-composition` controller. It uses a `js` `express` controller function as the response handler.


 - `StaticFiles:Class`. Type of `express-composition` controller. It returns [statically](https://expressjs.com/en/api.html#express.static) the contents of the files inside the directory specified.




------------------

## `Middleware`


**Type**:  *Class. Function.*


**Extends**:  `Composable`


**Description**:  




------------------------

### `Middleware.`


**Type**:  * *


**Description**:  




------------------------

### `middleware.`


**Type**:  * *


**Description**:  




------------------------

### `middleware.`


**Type**:  * *


**Description**:  




-----------------

## `StaticFiles`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that uses `express`'s [static middleware](https://expressjs.com/en/api.html#express.static).




------------------------

### `StaticFiles.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




------------------------

### `StaticFiles.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  `route:String`. URL path reserved for this controller.


 `middleware:Array<Function>`. Middlewares applied to this controller.


 `file:String`. File containing a `js` module used as `express` controller function, or factory.


 `cache:Boolean`. Whether or not the `js` module should be cached. When not cached, take into account that the registry of the `require` function is modified, and it can affect other parts of your project. By default, `true`.


 `silentMode:Boolean`. Whether or not the errors thrown should (not) be logged by console. Defaults to `true` (so, not logged).




------------------------

### `staticFiles.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




------------------------

### `staticFiles.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




------------------------

### `staticFiles.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for `this.path` to be a string.




------------------------

### `staticFiles.onController`


**Type**:  *Static class*


**Parameter**:  


 - `application:Object`. Application of the `express` framework.


**Returns**:  `controller:Function`. An `express` controller function.


**Description**:  Returns the result of using `express.static` with `this.path` and `this.options` properties.




--------------------

## `DownloadDirectory`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that, specified a `directory`, it can download its contained files (all the tree down) by a parameter:
  - specified in the path of the URL, by default.
  - specified as a querystring parameter, which name is defined in the `qsFile`.




-------------------

### `DownloadDirectory.CONTROLLER_ID`


**Type**:  `String`


**Description**:  Identifier name of the current controller.



-------------------

### `DownloadDirectory.DEFAULT_OPTIONS`


**Type**:  `Object`


**Description**:  Properties inherited by default for all controllers of this type.


**Property**:  


 - `method:String`. HTTP method used for this controller.


 - `route:String`. URL path reserved for this controller.


 - `middleware:Array<Function>`. Middlewares applied to this controller.


 - `directory:String`. Directory which contains only downloadable files.


 - `options:Object`. Options applied to the downloads of this directory. To see all the options, [here](https://expressjs.com/en/api.html#res.sendFile).


 - `callback:Function`. Function called just after the file was downloaded successfully. It receives a `context:Object`, which contains contextual data.


 - `qsFile:String`. *Optional*. Name of the querystring variable to specify the path of the file to be downloaded.




----------------

### `downloadDirectory.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




----------------------

### `downloadDirectory.onMount`


**Type**:  *Class method. Function.*


**Parameter**: 


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




------------------------

### `downloadDirectory.onError`


**Type**:  *Class method. Function.*


**Parameter**: 


 - `error:Error`. Error that arised. Not used.


 - `context:Object`. Object that contains contextual information.


**Description**:  Handles response on general errors. By default, it returns a 404 error message in plain text.




------------------------

### `downloadDirectory.onBadRequestError`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `error:Error`. Error that arised.


 - `context:Object`. Object that contains contextual information.


**Returns**:  `void`


**Description**:  Handles response on bad request error. This method is called when a malicious path is introduced, trying to reach files out of the directory. By default, it returns a 400 error message in plain text.




----------------------

### `downloadDirectory.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for the `this.directory` self property to be a string.




-------------------

### `downloadDirectory.onCreateContext`


**Parameter**:  


 - `application:Object`. Application of `express` framework.


 - `request:Object`. Request of `express` framework.


 - `response:Object`. Response of `express` framework.


 - `next:Function`. Typical `next` function of the `express` framework response chain.


**Returns**:  `context:Object`. Basic context of the current response.


**Description**:  Returns the basic context of the response.




-------------------

### `downloadDirectory.onController`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `controller:Function`. Valid `express` controller function. The returned function must receive `request, response, next` and handle the response adecuately.


**Description**:  Generates a controller function that will:
  - Create a context. Using `this.onCreateContext` method.
  - Get the path for a downloadable file. From querystring parameters when the property `qsFile` is a string, or from URL parameters, in the style of `/path/to/file`, by default.
  - Throw when the path or the file is not valid.
     - If the path was suspiciously bad intentioned, `this.onBadRequestError` is called.
     - On other errors, `this.onError` is called.
  - Respond with a file download to the request.
  - If an error arises, handle the error.
  - Otherwise, execute a callback.



-----------------

## `EjsTemplateDirectory`


**Type**:  *Class. Function.*


**Extends**:  `Controller`


**Description**:  Represents a controller that is able to render a specific [`ejs`](https://www.npmjs.com/package/ejs) template file which is placed inside a specific directory. The request must provide its path.




-----------------

### `EjsTemplateDirectory.CONTROLLER_ID`


**Type**:  *Static class property. String.*


**Description**:  Identifier name of the current controller.




-----------------

### `EjsTemplateDirectory.DEFAULT_OPTIONS`


**Type**:  *Static class property. Object.*


**Description**:  Default properties and methods that the class assigns to its instances by default.


**Property**:  


 - `method:String`. HTTP method used for this controller.


 - `route:String`. URL path reserved for this controller.


 - `middleware:Array<Function>`. Middlewares applied to this controller.


 - `directory:String`. Directory containing valid `ejs` files.


 - `options:Object`. Options applied to the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).


 - `qsFile:String`. Variable of the querystring parameters used to find the path of the `ejs` file to render. When omitted, this parameter is provided as (nesteable) URL parameters. Defaults to `undefined`.





-----------------

### `ejsTemplateDirectory.constructor`


**Type**:  *Class constructor. Function.*


**Parameter**: 


 - `options:Object`. Properties and methods that should be implemented by the instances that this class produces.


**Description**:  It only calls to the parent's constructor, passing the received `options:Object`.




-----------------

### `ejsTemplateDirectory.onMount`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object` Application of `express` framework.


**Returns**:  `void`


**Asynchronous**:  *Optional*. Optionally, the developer can convert this method to asynchronous, or return a `Promise` from it.


**Description**:  Mounts this instance of controller into the passed `express` `application:Object`, synchronously or asynchronously.




-----------------

### `ejsTemplateDirectory.onError`


**Type**:  *Class method. Function.*


**Parameter**:  `error:Error`. Error that arised. Not used.


 `context:Object`. Object that contains contextual information.


**Description**:  Handles response on general errors. By default, it returns a 404 error message in plain text.




-----------------

### `ejsTemplateDirectory.onBadRequestError`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `error:Error`. Error that arised.


 - `context:Object`. Object that contains contextual information.


**Returns**:  `void`


**Description**:  Handles response on bad request error. This method is called when a malicious path is introduced, trying to reach files out of the directory. By default, it returns a 400 error message in plain text.




-----------------

### `ejsTemplateDirectory.onValidate`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


**Returns**:  `void`


**Throws**:  `Error`. Error thrown by any validation.


**Description**:  Calls to the `onValidate` method of the parent, and also checks for `this.templateFile` or `this.templateFile` properties to exist.




-----------------

### `ejsTemplateDirectory.onCreateContext`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `application:Object`. Application of `express` framework.


 - `request:Object`. Request of `express` framework.


 - `response:Object`. Response of `express` framework.


 - `next:Function`. Typical `next` function of the `express` framework response chain.


**Returns**:  `context:Object`. Basic context of the current response.


**Description**:  Returns the basic context of the response.




-----------------

### `ejsTemplateDirectory.onRenderFile`


**Type**:  *Class method. Function.*


**Parameter**:  


 - `file:String`. Path of the `ejs` template file to render.


 - `parameters:Object`. Path of the `ejs` template file to render.


 - `options:Object`. Properties passed as options of the `ejs` rendering. To see all the options, [here](https://www.npmjs.com/package/ejs#options).


**Returns**:  `contents:Promise<String>`. Returns, asynchronously, the contents of the result of the rendered `file`, with the provided `parameters` and `options`.


**Throws**:  `error:Error`. The returned `Promise` can throw an error if there are problems while finding the file or rendering its contents.


**Description**:  Renders an `ejs` template file, and returns the result asynchronously.




-----------------

### `ejsTemplateDirectory.onController`


**Type**:  *Static class*


**Parameter**:  


 - `application:Object`. Application of the `express` framework.


**Returns**:  `controller:Function`. An `express` controller function.


**Description**:  Generates a controller function that finds the `ejs` template file (from URL or querystring parameters) placed inside a directory, renders it, and responds with its result.



