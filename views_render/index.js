'use strict';

var express = require('express');

var router = express.Router();



function renderview(pathToView,linkToView) {
    router.get(pathToView,function (req,res) {
        res.render(linkToView);
    })
}



renderview("/","index.ejs");
renderview("/hi","template/index.ejs");


module.exports = router;