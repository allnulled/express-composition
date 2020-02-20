const { expect } = require("chai");
const { SimpleController, AppComposer } = require(__dirname + "/../src/index.js");
const express = require("express");
const request = require("request");

describe("SimpleController controller test", function () {

    const PORT_1 = 8081;

    it("can respond a string", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            SimpleController.create({
                route: "/1",
                customMessage: "Hello, user!",
                function: (context, request, response, next) => {
                    const { _instance } = context;
                    return response.status(200).json({ message: _instance.customMessage });
                }
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function (error, response, body) {
                        expect(error).to.equal(null);
                        expect(JSON.parse(body)).to.deep.equal({ message: "Hello, user!" });
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

    it("throws on missing function option", function (done) {
        const errorMessage = "[SimpleController.onMount] Required property <function> as a function type.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            SimpleController.create({
                route: "/1",
                function: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});