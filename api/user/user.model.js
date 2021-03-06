/**
 * Created by phamquangkhang on 4/21/17.
 */
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

// var findOrCreate = require('mongoose-find-one-or-create');
var config = require('../auth/auth.config');
var messages = require("./user.message.json").messages;
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;


var user = new Schema({
    username: {
        type: String,
        lowercase: true,
        require: true,
        match: [emailRegex, messages.email_invalid],
        trim:true
    },
    name: {
        type: String,
        require: true,
        // uppercase: true,
        default:"",
        trim:true
    },
    role: {
        type: String,
        default: config.userRoles[0],
        enum: {
            values: config.userRoles,
            message: messages.role_invalid
        },
        lowercase: true,
        require: true,
        trim:true
    },
    isBlock: {//true is the same as:  user is existed but have been block by admin and can't login to the system
        type: Boolean,
        default: false,
        require: true
    },
    createdAt : { type: Date, required: true, default: Date.now },
    joinTime : {type: Date,required:true, default: Date.now},
    img : {type:String,default:""},
    about:{type:String,default:""},
    updatedAt : { type: Date, required: false},
    responsibility: {type:String,default:"Thành viên"},
    dob: {type:Date},
    gender: {type:Boolean,default:true}
    // nodes:[{type: Number, ref: "Node"}]
});

// user.plugin(findOrCreate);

user.pre('save', function (next) {
    // Handle new user update role

    if (config.domain.indexOf(this.username.toLowerCase().trim().split("@")[1]) >= 0) {//validate domain is accepted}
        // this.name = this.username.split("@")[0];
       if(this.name){
           var temp = this.name.split(" ");
           this.name = "";
           var that = this;
           temp.forEach(function (t) {
               t=t.substring(0,1).toUpperCase()+t.substring(1,t.length).toLowerCase();
               that.name+=t+" ";
           });
           this.name = this.name.trim();
       }
       return next();
    } else return next(new Error(messages.domain_err));

});


module.exports = mongoose.model('User', user);