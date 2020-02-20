const { expect } = require("chai");
const { AppComposer, BodyParserMiddleware, SimpleController } = require(__dirname + "/../src/index.js");
const express = require("express");
const request = require("request");

describe("BodyParserMiddleware class", function() {

    it("can work", function(done) {
        this.timeout(10 * 1000);
        const steps = [];
        const PORT = 8081;
        AppComposer.compose(express(), [
            SimpleController.create({
                method: "post",
                route: "/ok",
                middleware: BodyParserMiddleware.create({ method: "json" }),
                function: (context, request, response, next) => {
                    const contents = request.body.contents;
                    console.log(request.body);
                    expect(typeof contents).to.equal("object");
                    expect(contents.message).to.equal("json");
                    steps.push(0);
                    return response.send("ok!");
                }
            })
        ]).then(app => {
            const server = app.listen(PORT, () => {
                request.post({
                    url: `http://127.0.0.1:${PORT}/ok`,
                    body: { contents: { message: "json" } },
                    json: true,
                }, (error, response, body) => {
                    if(error) {
                        console.log(error);
                        expect(true).to.equal(false);
                    }
                    expect(body).to.equal("ok!");
                    expect(steps).to.deep.equal([0]);
                    server.close();
                    return done();
                });
            })
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

});