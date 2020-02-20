const path = require("path");
const express = require("express");
const request = require("request");
const { expect } = require("chai");
const { AppComposer, SimpleController } = require(__dirname + "/../src/index.js");

describe("AppComposer class", function () {
    this.timeout(10 * 1000);

    const serverDirectory = path.resolve(__dirname + "/servers/certificates-1");
    it("can create server and secure server", function (done) {
        AppComposer.createServers(express(), [
            SimpleController.create({
                route: "/ok",
                function: (context, request, response) => {
                    return response.send("OK!");
                }
            })
        ], {
            secureServer: true,
            secureServerOptions: {
                certificatesFolder: __dirname + "/servers/certificates"
            }
        }).then((results) => {
            const [app, server, secureServer] = results;
            server.listen(8080, () => {
                request("http://127.0.0.1:8080/ok", (error, response, body) => {
                    expect(body).to.equal("OK!");
                    console.log("[test-ok] Can create server");
                    server.close();
                    secureServer.listen(8081, () => {
                        request("https://127.0.0.1:8081/ok", { rejectUnauthorized: false }, (error, response, body) => {
                            expect(body).to.equal("OK!");
                            console.log("[test-ok] Can create secure server");
                            secureServer.close();
                            return done();
                        });
                    });
                });
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });
});
