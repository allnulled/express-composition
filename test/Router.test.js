const express = require("express");
const request = require("request");
const { expect } = require("chai");
const { AppComposer, Router } = require(__dirname + "/../src/index.js");

describe("Router controller class", function () {

    const PORT = 8081;

    it("can be mounted as normal (synchronously created) router", function (done) {
        this.timeout(10 * 1000);
        const steps = [];
        AppComposer.compose(express(), [
            Router.create({
                route: "/router",
                middleware: [(request, response, next) => {
                    steps.push(0);
                    setTimeout(next, 50);
                }],
                routing: (router, controller, application) => {
                    router.get("/", (request, response) => {
                        response.send("Hi, anonymous!");
                    });
                    router.get("/hi", (request, response) => {
                        response.send("Anonymous is also an organization!");
                    });
                }
            })
        ]).then(app => {
            const server = app.listen(PORT, async () => {
                try {
                    console.log(`[test] Application started at port :${PORT}`);
                    await new Promise(ok => {
                        request(`http://127.0.0.1:${PORT}/router`, function (error, response, body) {
                            if (error) {
                                console.log(error);
                                expect(true).to.equal(false);
                                return ok();
                            }
                            steps.push(1);
                            expect(body).to.equal("Hi, anonymous!");
                            return ok();
                        });
                    });
                    await new Promise(ok => {
                        request(`http://127.0.0.1:${PORT}/router/hi`, function (error, response, body) {
                            if (error) {
                                console.log(error);
                                expect(true).to.equal(false);
                                return ok();
                            }
                            steps.push(2);
                            expect(body).to.equal("Anonymous is also an organization!");
                            return ok();
                        });
                    });
                    expect(steps).to.deep.equal([0, 1, 0, 2]);
                    server.close();
                    return done();
                } catch (error) {
                    console.log(error);
                }
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("can be mounted as normal (asynchronously created) router", function (done) {
        this.timeout(10 * 1000);
        const steps = [];
        AppComposer.compose(express(), [
            Router.create({
                route: "/router",
                middleware: [(request, response, next) => {
                    steps.push(0);
                    setTimeout(next, 50);
                }],
                routing: (router, controller, application) => {
                    return new Promise(ok => {
                        router.get("/", (request, response) => {
                            response.send("Hi, anonymous!");
                        });
                        router.get("/hi", (request, response) => {
                            response.send("Anonymous is also an organization!");
                        });
                        steps.push(10);
                        setTimeout(ok, 50);
                    });
                }
            })
        ]).then(app => {
            const server = app.listen(PORT, async () => {
                try {
                    console.log(`[test] Application started at port :${PORT}`);
                    await new Promise(ok => {
                        request(`http://127.0.0.1:${PORT}/router`, function (error, response, body) {
                            if (error) {
                                console.log(error);
                                expect(true).to.equal(false);
                                return ok();
                            }
                            steps.push(1);
                            expect(body).to.equal("Hi, anonymous!");
                            return ok();
                        });
                    });
                    await new Promise(ok => {
                        request(`http://127.0.0.1:${PORT}/router/hi`, function (error, response, body) {
                            if (error) {
                                console.log(error);
                                expect(true).to.equal(false);
                                return ok();
                            }
                            steps.push(2);
                            expect(body).to.equal("Anonymous is also an organization!");
                            return ok();
                        });
                    });
                    expect(steps).to.deep.equal([10, 0, 1, 0, 2]);
                    server.close();
                    return done();
                } catch (error) {
                    console.log(error);
                }
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

    it("throws error when routing is not a function", (done) => {
        const errorMessage = "[Router.onValidate] Required property <routing> as a function type.";
        AppComposer.compose(express(), [
            Router.create({
                route: "/",
                routing: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            console.log(error.message);
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

    it("can refresh router by refresh method", (done) => {
        const PORT = 8081;
        const routes = [{
            method: "get",
            endpoint: "/1",
            controller: (request, response) => response.send("1")
        }];
        const customRouter = Router.create({
            route: "/",
            routing: (router, app) => {
                routes.forEach(route => {
                    router[route.method](route.endpoint, route.controller);
                });
            }
        });
        let server = undefined;
        AppComposer.compose(express(), [
            customRouter
        ]).then(app => {
            return new Promise((ok, fail) => {
                server = app.listen(PORT, () => ok());
            });
        }).then(() => {
            return new Promise((ok, fail) => {
                request(`http://127.0.0.1:${PORT}/1`, (error, response, body) => {
                    expect(body).to.equal("1");
                    ok();
                });
            });
        }).then(() => {
            return new Promise((ok, fail) => {
                routes.push({
                    method: "get",
                    endpoint: "/2",
                    controller: (request, response) => response.send("2")
                });
                request(`http://127.0.0.1:${PORT}/2`, (error, response, body) => {
                    expect(body).to.not.equal("2");
                    return ok();
                });
            });
        }).then(() => {
            return new Promise((ok, fail) => {
                customRouter.refresh();
                return ok();
            });
        }).then(() => {
            request(`http://127.0.0.1:${PORT}/2`, (error, response, body) => {
                if(error) {
                    return fail(error);
                }
                expect(body).to.equal("2");
                server.close();
                return done();
            });
        }).catch(error => {
            console.log(error);
            expect(true).to.equal(false);
        });
    });

});