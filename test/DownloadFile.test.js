const { expect } = require("chai");
const { DownloadFile, AppComposer } = require(__dirname + "/../src/index.js");
const CommonUtilities = require(__dirname + "/../src/CommonUtilities.js");
const fs = require("fs");
const express = require("express");
const request = require("request");

describe("DownloadFile controller test", function () {

    const PORT_1 = 8081;
    const downloadFile = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            // console.log("Content-Type:", res.headers["Content-Type"]);
            // console.log("Content-Length:", res.headers["Content-Length"]);
            request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
        });
    };

    it("can download a simple file + do a callback", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            DownloadFile.create({
                route: "/1",
                file: __dirname + "/downloads/file-1.txt",
                callback: () => "just for coverage"
            }),
            DownloadFile.create({
                route: "/2",
                file: __dirname + "/downloads/file-1.txt"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1`;
                    const targetFile = __dirname + "/downloads/file-1.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    downloadFile(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File one");
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2`;
                    const targetFile = __dirname + "/downloads/file-2.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    downloadFile(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File one");
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

    it("throws 404 when file not found", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            DownloadFile.create({
                route: "/3",
                file: __dirname + "/downloads/file-2.not-exists.txt"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/3`;
                    const targetFile = __dirname + "/downloads/file-3.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    downloadFile(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
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

    it("throws on missing file option", function (done) {
        const errorMessage = "[DownloadFile.onMount] Required property <file> as a string type.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            DownloadFile.create({
                route: "/1",
                file: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});