/**
 * Created by phamquangkhang on 4/12/17.
 */
'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configGoogleServer = require('../google.server.config.json').google;
var logger = require("../../logger");
var flag = false;
module.exports = function (User) {

    passport.serializeUser(function (user, done) {
        // done(null, user.id);
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        // Users.findById(obj, done);
        done(null, obj);
    });

    passport.use(new GoogleStrategy(configGoogleServer,
        function (accessToken, refreshToken, profile, done) {
            // console.log('id : ' + profile.id);
            // console.log('name :' + profile.displayName);
            // console.log('emails :' + profile.emails[0].value.toLowerCase());
            User.findOne({username: profile.emails[0].value.toLowerCase()})
                .exec(
                    function (err, data) {
                        // console.log(data)
                        if (data) {
                            // console.log(profile);
                            profile.role    = data.role;
                            profile.isBlock = data.isBlock;
                            if(!data.name || data.name === ""){
                                profile.name = profile.displayName;
                                data.name = profile.displayName;
                                flag = true;
                            }else {
                                profile.name = data.name;
                            }

                            if(flag){
                                data.updatedAt = Date.now();
                                data.save(function (err, newData) {
                                    if (err) {
                                        logger.error(err);
                                    } else {
                                        logger.info(data.username+": INIT UPDATE SUCCESS");
                                    }
                                });
                            }
                            // profile.name = data.name;
                            return done(err, profile);
                        } else
                            return done(err, null);
                    }
                )
        }
    ));

}
