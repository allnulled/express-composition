const request = require("request");
const express = require("express");
const { expect } = require("chai");
const { AppComposer, MultipartFormMiddleware, SimpleController } = require(__dirname + "/../src/index.js");

describe("MultipartFormMiddleware class", function() {
    
    it("can work", function(done) {
        this.timeout(10*1000);
        const PORT = 8081;
        AppComposer.compose(express(), [
            SimpleController.create({
                route: "/ok",
                middleware: [MultipartFormMiddleware.create()],
                function: (context, request, response, next) => response.send("OK!")
            })
        ]).then(app => {
            const server = app.listen(PORT, () => {
                request(`http://127.0.0.1:${PORT}/ok`, (error, response, body) => {
                    if(error) {
                        console.log(error);
                        expect(true).to.equal(false);
                        return;
                    }
                    expect(body).to.equal("OK!");
                    server.close();
                    return done();
                });
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        })
    });

});