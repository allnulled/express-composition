const { expect } = require("chai");
const { EjsTemplateDirectory, JsFunction, AppComposer } = require(__dirname + "/../src/index.js");
const CommonUtilities = require(__dirname + "/../src/CommonUtilities.js");
const fs = require("fs");
const express = require("express");
const request = require("request");

describe("EjsTemplateDirectory controller test", function () {

    const PORT_1 = 8081;

    it("can render a simple file + do a callback + 404 not found when no file is found + 400 bad request when file is out of directory", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            EjsTemplateDirectory.create({
                route: "/1",
                directory: __dirname + "/templates",
                callback: () => "just for coverage"
            }),
            EjsTemplateDirectory.create({
                route: "/2",
                directory: __dirname + "/templates"
            }),
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/good-night`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal("Good night, anonymous!");
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/good-midnight`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/../EjsTemplateDirectory.js`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_400);
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2/good-night`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal("Good night, anonymous!");
                        return ok();
                    });
                });
                server.close();
                console.log(`[test] Application closed.`);
                done();
                return;
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("can can use querystring variables for file path + 404 not found when no file is found + 400 bad request when file is out of directory", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            EjsTemplateDirectory.create({
                route: "/1",
                directory: __dirname + "/templates",
                qsFile: "file",
                callback: () => "just for coverage"
            }),
            EjsTemplateDirectory.create({
                route: "/2",
                directory: __dirname + "/templates",
                qsFile: "file"
            }),
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                // Correct path, correct file, with callback
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1?file=good-night`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal("Good night, anonymous!");
                        return ok();
                    });
                });
                // Correct path, correct file, without callback
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2?file=good-night`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal("Good night, anonymous!");
                        return ok();
                    });
                });
                // Correct path, not-found file
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1?file=good-night-does-not-exist`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
                        return ok();
                    });
                });
                // Incorrect path
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2?file=../../package.json`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_400);
                        return ok();
                    });
                });
                server.close();
                console.log(`[test] Application closed.`);
                done();
                return;
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("throws 404 when file not found", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            EjsTemplateDirectory.create({
                route: "/3",
                directory: __dirname + "/templates"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/3/non-existing-template`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function(error, response, body) {
                        expect(body).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
                        return ok();
                    });
                });
                server.close();
                console.log(`[test] Application closed.`);
                done();
                return;
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("throws on missing directory option", function (done) {
        const errorMessage = "[EjsTemplateDirectory.onMount] Required property <directory> as a string type.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            EjsTemplateDirectory.create({
                route: "/1",
                directory: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});