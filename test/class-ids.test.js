const { expect } = require("chai");
const {
    DownloadDirectory,
    DownloadFile,
    EjsTemplate,
    EjsTemplateDirectory,
    FileController,
    SimpleController,
    Middleware,
    StaticFiles,
} = require(__dirname + "/../src/index.js");

describe("Property CONTROLLER_ID of any Controller", function () {

    it("corresponds to each class", function () {
        expect(DownloadDirectory.CONTROLLER_ID).to.equal("DownloadDirectory");
        expect(DownloadFile.CONTROLLER_ID).to.equal("DownloadFile");
        expect(EjsTemplate.CONTROLLER_ID).to.equal("EjsTemplate");
        expect(EjsTemplateDirectory.CONTROLLER_ID).to.equal("EjsTemplateDirectory");
        expect(FileController.CONTROLLER_ID).to.equal("FileController");
        expect(SimpleController.CONTROLLER_ID).to.equal("SimpleController");
        expect(StaticFiles.CONTROLLER_ID).to.equal("StaticFiles");
    });

});

describe("Property MIDDLEWARE_ID of any Middleware", function () {

    it("corresponds to each class", function () {
        expect(Middleware.MIDDLEWARE_ID).to.equal("Middleware");
    });

});