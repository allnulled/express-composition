const { expect } = require("chai");
const { DownloadDirectory, SimpleController, AppComposer } = require(__dirname + "/../src/index.js");
const CommonUtilities = require(__dirname + "/../src/CommonUtilities.js");
const fs = require("fs");
const express = require("express");
const request = require("request");

describe("DownloadDirectory controller test", function () {

    const PORT_1 = 8081;
    const download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            // console.log("Content-Type:", res.headers["Content-Type"]);
            // console.log("Content-Length:", res.headers["Content-Length"]);
            request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
        });
    };

    it("can download a simple file + do a callback + 404 not found when no file is found + 400 bad request when file is out of directory", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            DownloadDirectory.create({
                route: "/1",
                directory: __dirname + "/downloads",
                callback: () => "just for coverage"
            }),
            DownloadDirectory.create({
                route: "/2",
                directory: __dirname + "/downloads/folder-1"
            }),
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/file-1.txt`;
                    const targetFile = __dirname + "/downloads/file-1.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File one");
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/file-2.txt`;
                    const targetFile = __dirname + "/downloads/file-not-found.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1/../file-2.txt`;
                    const targetFile = __dirname + "/downloads/file-bad-request.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_400);
                        return ok();
                    });
                });
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2/file-2.txt`;
                    const targetFile = __dirname + "/downloads/folder-1-file-2.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File 2");
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

    it("can can use querystring variables for file path + 404 not found when no file is found + 400 bad request when file is out of directory", function (done) {
        this.timeout(10 * 1000);
        AppComposer.compose(express(), [
            DownloadDirectory.create({
                route: "/1",
                directory: __dirname + "/downloads",
                qsFile: "file",
                callback: () => "just for coverage"
            }),
            DownloadDirectory.create({
                route: "/2",
                directory: __dirname + "/downloads",
                qsFile: "file"
            }),
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                // Correct path, correct file, with callback
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1?file=file-1.txt`;
                    const targetFile = __dirname + "/downloads/file-5.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File one");
                        return ok();
                    });
                });
                // Correct path, correct file, without callback
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2?file=file-1.txt`;
                    const targetFile = __dirname + "/downloads/file-6.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal("File one");
                        return ok();
                    });
                });
                // Correct path, not-found file
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/1?file=file-x.txt`;
                    const targetFile = __dirname + "/downloads/file-7.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_404);
                        return ok();
                    });
                });
                // Incorrect path
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/2?file=../../package.json`;
                    const targetFile = __dirname + "/downloads/file-8.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    try {
                        fs.unlinkSync(targetFile);
                    } catch(error) {}
                    download(targetURL, targetFile, function() {
                        const targetContents = fs.readFileSync(targetFile).toString();
                        expect(targetContents).to.equal(CommonUtilities.HTTP_RESPONSES.ERROR_400);
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
            DownloadDirectory.create({
                route: "/3",
                directory: __dirname + "/downloads"
            })
        ]).then(app => {
            const server = app.listen(PORT_1, async function () {
                console.log(`[test] Application started on port :${PORT_1}`);
                await new Promise((ok) => {
                    const targetURL = `http://127.0.0.1:${PORT_1}/3/non-existing-file.txt`;
                    const targetFile = __dirname + "/downloads/file-3.downloaded.txt";
                    console.log(`[test] Request to: ${targetURL}`);
                    download(targetURL, targetFile, function() {
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

    it("throws on missing directory option", function (done) {
        const errorMessage = "[DownloadDirectory.onMount] Required property <directory> as a string type.";
        this.timeout(5 * 1000);
        AppComposer.compose(express(), [
            DownloadDirectory.create({
                route: "/1",
                directory: undefined
            })
        ]).then(app => {
            expect(true).to.equal(false);
        }).catch(error => {
            expect(error.message).to.equal(errorMessage);
            return done();
        });
    });

});