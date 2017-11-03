

var path = require('path');
var service = require('./api/auth/service');
var userModel = require('./api/user/user.model');
var moment = require('moment');
module.exports = function (app) {
    // app.use("/api",require("./api"));

    app.use("/api/auth", require("./api/auth"));
    app.use("/api/user", require("./api/user"));
    app.use("/",require("./views_render"));


}