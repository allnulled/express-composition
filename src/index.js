const AppComposer = require(__dirname + "/AppComposer.js");
const Composable = require(__dirname + "/Composable.js");
const Controller = require(__dirname + "/Controller.js");
const DownloadFile = require(__dirname + "/DownloadFile.js");
const DownloadDirectory = require(__dirname + "/DownloadDirectory.js");
const EjsTemplate = require(__dirname + "/EjsTemplate.js");
const EjsTemplateDirectory = require(__dirname + "/EjsTemplateDirectory.js");
const JsFile = require(__dirname + "/JsFile.js");
const JsFunction = require(__dirname + "/JsFunction.js");
const MySqlRestApi = require(__dirname + "/mysql/MySqlRestApi.js");
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
 * @property - `JsFile:Class`. Type of `express-composition` controller. It uses a `js` file that exports a simple `express` controller function as the response handler.
 * @property - `JsFunction:Class`. Type of `express-composition` controller. It uses a `js` `express` controller function as the response handler.
 * @property - `StaticFiles:Class`. Type of `express-composition` controller. It returns [statically](https://expressjs.com/en/api.html#express.static) the contents of the files inside the directory specified.
 * 
 */
module.exports = {
    AppComposer,
    Composable,
    Controller,
    DownloadFile,
    DownloadDirectory,
    EjsTemplate,
    EjsTemplateDirectory,
    JsFile,
    JsFunction,
    MySqlRestApi,
    StaticFiles,
};