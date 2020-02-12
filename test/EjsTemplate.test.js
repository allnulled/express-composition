const { expect } = require("chai");
const { EjsTemplate, AppComposer } = require(__dirname + "/../src/index.js");
const express = require("express");
const request = require("request");

describe("EjsTemplate controller test", function () {

    const PORT_1 = 8081;

    it("can render strings or files", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            EjsTemplate.create({
                route: "/1",
                template: "Good morning, <?=request.query.name || 'anonymous'?>!",
                parameters: {},
                options: {
                    delimiter: "?"
                }
            }),
            EjsTemplate.create({
                route: "/2",
                template: "Good night, <?=request.query.name || 'anonymous'?>!",
                parameters: {},
                options: {
                    delimiter: "?"
                }
            }),
            EjsTemplate.create({
                route: "/3",
                templateFile: __dirname + "/templates/good-evening.ejs",
                parameters: {},
                options: {
                    delimiter: "?"
                }
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise(async function (success, failure) {
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good morning, anonymous!");
                            return ok();
                        });
                    });
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/1?name=Carl`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good morning, Carl!");
                            return ok();
                        });
                    });
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/2`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good night, anonymous!");
                            return ok();
                        });
                    });
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/2?name=Carl`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good night, Carl!");
                            return ok();
                        });
                    });
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/3`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good evening, anonymous!");
                            return ok();
                        });
                    });
                    await new Promise((ok) => {
                        const targetURL = `http://127.0.0.1:${PORT_1}/3?name=Carl`;
                        console.log(`[test] Request to: ${targetURL}`);
                        request(targetURL, function (error, response, body) {
                            expect(error).to.equal(null);
                            expect(body).to.equal("Good evening, Carl!");
                            return ok();
                        });
                    });
                    success();
                    return;
                });
                server.close();
                console.log(`[test] Application closed.`);
                done();
                return;
            });
        }).catch(error => {
            console.log("[test] ERROR: EjsTemplate Test failed.", error);
            expect(true).to.equal(false);
        });
    });

    it("throws on missing templateFile && template options", function (done) {
        const errorMessage = "[EjsTemplate.onMount] Required property <templateFile>-or-<template> is not defined.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            EjsTemplate.create({
                route: "/1",
                // template: "Good morning, <?=request.query.name || 'anonymous'?>!",
                parameters: {},
                options: {
                    delimiter: "?"
                }
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

    it("throws on template errors", function (done) {
        const errorMessage = "A random error";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            EjsTemplate.create({
                route: "/1",
                templateFile: __dirname + "/templates/error-thrown.ejs",
                parameters: {},
                options: {
                    delimiter: "%"
                }
            }),
            EjsTemplate.create({
                route: "/2",
                template: '<% throw new Error("A random error"); %>',
                parameters: {},
                options: {
                    delimiter: "%"
                },
                silentMode: false
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                    console.log(`[test] Request to: ${targetURL}`);
                    request(targetURL, function (error, response, body) {
                        expect(body).to.equal("HTTP 500 error: Internal Server Error");
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