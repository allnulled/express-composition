const { expect } = require("chai");
const { StaticFiles, AppComposer } = require(__dirname + "/../src/index.js");
const express = require("express");
const request = require("request");

describe("StaticFiles controller test", function () {

    const PORT_1 = 8081;

    it("can respond a string", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            StaticFiles.create({
                route: "/cdn",
                path: __dirname + "/statics"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, function() {
                console.log(`[test] Application started on port :${PORT_1}`);
                const targetURL = `http://127.0.0.1:${PORT_1}/cdn/1.txt`;
                console.log(`[test] Request to: ${targetURL}`);
                request(targetURL, function (error, response, body) {
                    expect(error).to.equal(null);
                    expect(body).to.deep.equal("bla bla bla");
                    server.close();
                    console.log(`[test] Application closed.`);
                    done();
                });
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("throws on missing path option", function(done) {
        this.timeout(10 * 1000);
        const errorMessage = "[StaticFiles.onMount] Required property <path> as a string type.";
        AppComposer.compose(express(), [
            StaticFiles.create({
                route: "/cdn",
                // path: __dirname + "/statics"
            })
        ]).then(app => {
            console.log(error);
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});