const { expect } = require("chai");
const {
    DownloadDirectory,
    DownloadFile,
    EjsTemplate,
    EjsTemplateDirectory,
    JsFile,
    JsFunction,
    StaticFiles,
} = require(__dirname + "/../src/index.js");

describe("Property CONTROLLER_ID of any Controller", function () {

    it("corresponds to each class", function () {
        expect(DownloadDirectory.CONTROLLER_ID).to.equal("DownloadDirectory");
        expect(DownloadFile.CONTROLLER_ID).to.equal("DownloadFile");
        expect(EjsTemplate.CONTROLLER_ID).to.equal("EjsTemplate");
        expect(EjsTemplateDirectory.CONTROLLER_ID).to.equal("EjsTemplateDirectory");
        expect(JsFile.CONTROLLER_ID).to.equal("JsFile");
        expect(JsFunction.CONTROLLER_ID).to.equal("JsFunction");
        expect(StaticFiles.CONTROLLER_ID).to.equal("StaticFiles");
    });

});