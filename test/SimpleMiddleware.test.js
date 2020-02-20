const express = require("express");
const request = require("request");
const { expect } = require("chai");
const { AppComposer, Middleware, SimpleMiddleware, SimpleController } = require(__dirname + "/../src/index.js");

describe("SimpleMiddleware class", function () {

    const PORT = 8080;

    it("fits with a SimpleController controller", function (done) {
        this.timeout(12 * 1000);
        const midds = [];
        AppComposer.compose(express(), [
            SimpleController.create({
                route: "/1",
                function: (context, request, response) => response.send("Hi, all!"),
                middleware: [
                    Middleware.create(),
                    Middleware.create({
                        middleware: [
                            function(request, response, next) {
                                midds.push(0);
                                setTimeout(() => {
                                    midds.push(0);
                                    return next();
                                }, 50);
                            },
                            function(request, response, next) {
                                midds.push(1);
                                setTimeout(() => {
                                    midds.push(1);
                                    return next();
                                }, 50);
                            }
                        ]
                    }),
                    SimpleMiddleware.create([
                        (context, request, response, next) => {
                            midds.push(2);
                            setTimeout(() => {
                                midds.push(2);
                                next();
                            }, 50);
                        },
                        (context, request, response, next) => {
                            midds.push(3);
                            setTimeout(() => {
                                midds.push(context._instance.parameters);
                                next();
                            }, 50);
                        }
                    ], {
                        parameters: [1,2,3]
                    }),
                    SimpleMiddleware.create([
                        (context, request, response, next) => next()
                    ])
                ],
            })
        ]).then(app => {
            const server = app.listen(PORT, () => {
                console.log(`[test] Application started at port :${PORT}`);
                return request(`http://127.0.0.1:${PORT}/1`, function(error, response, body) {
                    if(error) {
                        console.log("Response error arised", error);
                        server.close();
                        return expect(true).to.equal(false);
                    }
                    expect(body).to.equal("Hi, all!");
                    expect(midds).to.deep.equal([0,0,1,1,2,2,3,[1,2,3]]);
                    server.close();
                    return done();
                });
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

});