/**
 * Created by phamquangkhang on 4/21/17.
 */
'use strict';

var User = require("./user.model");
var messages = require("./user.message.json").messages;
var authRole = require("../auth/auth.config").userRoles;
// var logController = require("../log/log.controller");
// var logger = require('winston');
var util = require('../util');
module.exports = {
    addUser: function (req, res) {
        var addingUser = {
            username: req.body.username,
            role: req.body.role,
            name: req.body.name || "",
            gender: req.body.gender || true,
            joinTime: req.body.joinTime,
            img: req.body.img || "",
            dob: req.body.dob,
            responsibility: req.body.responsibility || "Thành viên",
            about: req.body.about || ""
        };
        console.log(addingUser.username);
        if (!addingUser.username || !addingUser.role) {
            res.json({status: false, message: messages.empty_info_validate});
        } else {
            addingUser.username = addingUser.username.toLowerCase().trim();
            addingUser.role = addingUser.role.toLowerCase().trim();
            if (util.CompareRole1IsSmallerThanRole2(req.user.role, role) || authRole.indexOf(addingUser.role) < 0) {
                //neu role cua nguoi add ma nho hon role duoc add thi khong duoc phep
                res.json({status: false, message: messages.authority_message});
            }
            else {
                User.findOne({username: addingUser.username}).exec(function (err, data) {
                    if (data) {
                        res.json({status: false, message: messages.username_existed});
                    } else {
                        if (!addingUser.joinTime instanceof Date || !addingUser.dob instanceof Date) {
                            try {
                                addingUser.joinTime = new Date(addingUser.joinTime);
                            } catch (err) {
                                addingUser.joinTime = Date.now;
                            }

                            try {
                                addingUser.dob = new Date(addingUser.dob);
                            } catch (err) {
                                addingUser.dob = "";
                            }
                        }
                        var newUser = new User(addingUser);
                        newUser.validate(function (err) {
                            if (err) {
                                console.log(String(err));
                                res.json({status: false, message: String(err).split(":")[2]});//message in validation
                            } else {
                                User.create(newUser, function (err, data) {
                                    if (!err) {
                                        // console.log("data:" + data);
                                        // logController.addLogAuto(req, newUser.username, "add", "Adding new User");
                                        res.json({status: true, message: messages.add_user_status.success});
                                    } else {
                                        // console.log("data:" + data);
                                        res.json({status: false, message: err.message});//message in pre save

                                    }
                                });
                            }
                        })
                    }
                })
            }
        }
    },
    blockUser: function (req, res) {
        var username;
        if (username = req.body.username) {
            username = username.toLowerCase().trim();
            User.findOne({username: username}).exec(
                function (err, data) {
                    if (data) {
                        if (util.CompareRole1IsSmallerThanRole2(data.role, req.user.role)) {
                            data.isBlock = true;
                            data.save(function (err, newData) {
                                if (err) {
                                    res.json({status: false, message: messages.block_user_status.fail});
                                } else {
                                    // logController.addLogAuto(req, username, "block", "Block User");
                                    res.json({status: true, message: messages.block_user_status.success});
                                }
                            });
                        } else {
                            res.json({status: false, message: messages.authority_message});
                        }

                    } else {
                        res.json({status: false, message: messages.username_not_existed});
                    }
                }
            )
        } else {
            res.json({status: false, message: messages.username_require})

        }

    },
    unBlockUser: function (req, res) {
        var username;
        if (username = req.body.username) {
            username = username.trim().toLowerCase();
            User.findOne({username: username}).exec(
                function (err, data) {
                    if (data) {
                        if (!util.CompareRole1IsSmallerThanRole2(req.user.role, data.role)) {
                            data.isBlock = false;
                            data.save(function (err, newData) {
                                if (err) {
                                    res.json({status: false, message: messages.unblock_user_status.fail});
                                } else {
                                    // logController.addLogAuto(req, username, "unBlock", "Un-Block User");
                                    res.json({status: true, message: messages.unblock_user_status.success});
                                }
                            });
                        } else {
                            res.json({status: false, message: messages.authority_message});
                        }

                    } else {
                        res.json({status: false, message: messages.username_not_existed});
                    }
                }
            )
        } else {
            res.json({status: false, message: messages.username_require})

        }

    },
    editUser:function (req,res) {
        var editingUser = {
            username: req.body.username,
            role: req.body.role,
            name: req.body.name,
            gender: req.body.gender,
            joinTime: req.body.joinTime,
            img: req.body.img ,
            dob: req.body.dob,
            updateTime: Date.now,
            responsibility: req.body.responsibility,
            about: req.body.about
        };





    },
    // editRole: function (req, res) {//
    //     var username, role;
    //     var beforeRole;
    //     if (req.body.username && req.body.role) {
    //         username = req.body.username.toLowerCase().trim();
    //         role = req.body.role.toLowerCase().trim();
    //         User.findOne({username: username}).exec(
    //             function (err, data) {
    //                 if (data) {
    //                     if (role === data.role) {
    //                         res.json({status: false, message: messages.role_current});
    //                     } else
    //                     //nếu role của người thực hiện không nhỏ hơn role sẽ sửa đổi và role của người được đổi phải nhỏ hơn role của người thực hiện
    //                     if (!util.CompareRole1IsSmallerThanRole2(req.user.role, role)
    //                         && util.CompareRole1IsSmallerThanRole2(data.role, req.user.role)
    //                     ) {
    //                         data.role = role;
    //                         data.save(function (err, newData) {
    //                             if (err) {
    //                                 res.json({status: false, message: messages.update_user_status.fail});
    //                             }
    //                             else {
    //                                 // logController.addLogAuto(req, username, "modify", "Update role from '" + beforeRole + "' to '" + role + "'");
    //                                 res.json({status: true, message: messages.update_user_status.success});
    //
    //                             }
    //                         });
    //                     } else {
    //                         res.json({status: false, message: messages.access_denied});
    //                     }
    //                 } else {
    //                     res.json({status: false, message: messages.username_not_existed});
    //                 }
    //             }
    //         )
    //     } else {
    //         res.json({status: false, message: messages.username_require})
    //
    //     }
    //
    // },
    findAll: function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        User.find().exec(function (err, data) {
            res.json({userList: data});
        });
    }


}
