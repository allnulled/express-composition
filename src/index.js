const AppComposer = require(__dirname + "/AppComposer.js");
const BodyParserMiddleware = require(__dirname + "/BodyParserMiddleware.js");
const Composable = require(__dirname + "/Composable.js");
const CommonUtilities = require(__dirname + "/CommonUtilities.js");
const Controller = require(__dirname + "/Controller.js");
const CorsMiddleware = require(__dirname + "/CorsMiddleware.js");
const DownloadFile = require(__dirname + "/DownloadFile.js");
const DownloadDirectory = require(__dirname + "/DownloadDirectory.js");
const EjsTemplate = require(__dirname + "/EjsTemplate.js");
const EjsTemplateDirectory = require(__dirname + "/EjsTemplateDirectory.js");
const FileController = require(__dirname + "/FileController.js");
const SimpleController = require(__dirname + "/SimpleController.js");
const Middleware = require(__dirname + "/Middleware.js");
const MultipartFormMiddleware = require(__dirname + "/MultipartFormMiddleware.js");
// const MySqlRestApi = require(__dirname + "/mysql/MySqlRestApi.js");
const Router = require(__dirname + "/Router.js");
const RoutingStack = require(__dirname + "/RoutingStack.js");
const SimpleMiddleware = require(__dirname + "/SimpleMiddleware.js");
const StaticFiles = require(__dirname + "/StaticFiles.js");

/**
 * 
 * ------------------
 * 
 * ## `src/index.js` **(`package.json#main`)**
 * @type *Object.*
 * @description The object returned by `require("express-composition")`.
 * @property 
 * @property - `AppComposer:Class`. Class used to compose `express` applications using `express-composition` controllers.
 * @property - `Composable:Class`. Utility class.
 * @property - `Controller:Class`. Utility class.
 * @property - `DownloadFile:Class`. Type of `express-composition` controller. It [downloads](https://expressjs.com/en/api.html#res.download) one specific file.
 * @property - `DownloadDirectory:Class`. Type of `express-composition` controller. It lets the user [download](https://expressjs.com/en/api.html#res.download) files placed inside a directory, specifying the path of the file.
 * @property - `EjsTemplate:Class`. Type of `express-composition` controller. It renders a specific [`ejs`](https://www.npmjs.com/package/ejs) template file.
 * @property - `EjsTemplateDirectory:Class`. Type of `express-composition` controller. It lets the user render [`ejs`](https://www.npmjs.com/package/ejs) template files placed inside a directory, specifying the path of the file.
 * @property - `FileController:Class`. Type of `express-composition` controller. It uses a `js` file that exports a simple `express` controller function as the response handler.
 * @property - `SimpleController:Class`. Type of `express-composition` controller. It uses a `js` `express` controller function as the response handler.
 * @property - `Middleware:Class`. Utility class.
 * @property - `SimpleMiddleware:Class`. Type of `express-composition` middleware. It accepts normal functions as middleware.
 * @property - `StaticFiles:Class`. Type of `express-composition` controller. It returns [statically](https://expressjs.com/en/api.html#express.static) the contents of the files inside the directory specified.
 * 
 */
module.exports = {
    AppComposer,
    BodyParserMiddleware,
    Composable,
    CommonUtilities,
    Controller,
    CorsMiddleware,
    DownloadFile,
    DownloadDirectory,
    EjsTemplate,
    EjsTemplateDirectory,
    FileController,
    Middleware,
    MultipartFormMiddleware,
    // MySqlRestApi,
    Router,
    RoutingStack,
    SimpleController,
    SimpleMiddleware,
    StaticFiles,
};