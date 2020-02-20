const request = require("request");
const express = require("express");
const { expect } = require("chai");
const { AppComposer, CorsMiddleware, SimpleController } = require(__dirname + "/../src/index.js");

describe("CorsMiddleware class", function() {
    
    it("can work", function(done) {
        this.timeout(10*1000);
        AppComposer.compose(express(), [
            SimpleController.create({
                route: "/ok",
                middleware: [CorsMiddleware.create()],
                function: (context, request, response, next) => response.send("OK!")
            })
        ]).then(app => {
            const server = app.listen(8080, () => {
                request("http://127.0.0.1:8080/ok", (error, response, body) => {
                    if(error) {
                        expect(true).to.equal(false);
                        return;
                    }
                    expect(body).to.equal("OK!");
                    server.close();
                    return done();
                });
            });
        }).catch(error => {
            expect(true).to.equal(false);
        })
    });

});