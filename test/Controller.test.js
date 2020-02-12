const { expect } = require("chai");
const { Controller, AppComposer } = require(__dirname + "/../src/index.js");
const express = require("express");

describe("Controller controller test", function () {

    const PORT_1 = 8081;

    it("cannot be used, must override onMount method", function (done) {
        this.timeout(10 * 1000);
        const errorMessage = "[express-composition][Controller.onMount] Method <onMount> must be overriden.";
        AppComposer.compose(express(), [
            Controller.create({})
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});