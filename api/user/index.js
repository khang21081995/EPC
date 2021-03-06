/**
 * Created by phamquangkhang on 4/21/17.
 */
'use strict';

var express = require('express');
var controller = require('./user.controller');
var authService = require('../auth/service');
var roles = require('../auth/auth.config');
var userService = require("./user.service");
var router = express.Router();


/***************************** api/user  *****************************/

router.put("/block", authService.hasRole(roles.userRoles[1]), userService.checkAcceptAble(), controller.blockUser);// need manager roles
router.put("/unblock", authService.hasRole(roles.userRoles[1]), userService.checkAcceptAble(), controller.unBlockUser);// need manager roles
router.post("/adduser", authService.hasRole(roles.userRoles[1]), userService.checkAcceptAble(), controller.addUser);//need manager roles
router.post("/addusertest", controller.addUser);//need manager roles
// router.post("/editrole", authService.hasRole(roles.userRoles[1]), userService.checkAcceptAble(), controller.editRole);//need manager roles

router.get("/findAll", authService.hasRole(roles.userRoles[1]), userService.checkAcceptAble(), controller.findAll);
router.get("/findAllTest",  controller.findAll);
module.exports = router;