const express = require("express");
const app = express();

app.use("/static2", [(request, response, next) => {
    console.log("next!!!");
    next();
}], express.static(__dirname + "/statics"));

app.post("/static", [(request, response, next) => {
    console.log("next!!!");
    next();
}], express.static(__dirname + "/statics"));

app.listen(8081);
