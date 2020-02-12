const { expect } = require("chai");
const { Composable } = require(__dirname + "/../src/index.js");
const composed = new Composable({a:0});
expect(composed.a).to.equal(0);