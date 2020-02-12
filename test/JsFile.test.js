const { expect } = require("chai");
const { JsFile, AppComposer } = require(__dirname + "/../src/index.js");
const express = require("express");
const request = require("request");

describe("JsFile controller test", function () {

    const PORT_1 = 8081;

    it("can render strings or files", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            JsFile.create({
                route: "/1",
                symbol: "!",
                file: __dirname + "/controllers/good-afternoon.js"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function (error, response, body) {
                        expect(error).to.equal(null);
                        expect(body).to.deep.equal("Hello, anonymous!");
                        return ok();
                    });
                });
                server.close();
                console.log(`[test] Application closed.`);
                done();
                return;
            });
        }).catch(error => {
            expect(true).to.equal(false);
        });
    });
    
    it("throws on missing file option", function (done) {
        const errorMessage = "[JsFile.onMount] Required property <file> as a string type.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            JsFile.create({
                route: "/1",
                symbol: "!",
                file: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

    it("throws on file errors", function (done) {
        const errorMessage = "A random error";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            JsFile.create({
                route: "/1",
                symbol: "!",
                file: __dirname + "/controllers/error-thrown.js",
                cache: false,
                silentMode: false
            }),
            JsFile.create({
                route: "/2",
                symbol: "!",
                file: __dirname + "/controllers/error-thrown.js",
                silentMode: true
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                    console.log(`[test] Request to: ${targetURL}`);
                    console.log(`[test] Following error message is part of the test...:`);
                    request(targetURL, function (error, response, body) {
                        expect(body).to.equal("HTTP 500 error: Internal Server Error");
                        console.log(`[test] ...Previous error message is part of the test.`);
                        console.log(`[test] Application closed.`);
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2`;
                    console.log(`[test] Request to: ${targetURL}`);
                    console.log(`[test] Following error message is part of the test...:`);
                    request(targetURL, function (error, response, body) {
                        expect(body).to.equal("HTTP 500 error: Internal Server Error");
                        console.log(`[test] ...Previous error message is part of the test.`);
                        console.log(`[test] Application closed.`);
                        return ok();
                    });
                });
                server.close();
                return done();
            });
        }).catch(error => {
            expect(true).to.equal(false);
        });
    });

});