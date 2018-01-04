"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../../models/user");

module.exports = function () {
  passport.use(new LocalStrategy({
    usernameField: "login",
    passwordField: "password"
  }, function (login, password, done) {
    return User.findOne({
      login
    }, function (err, user) {
      return err
        ? done(err)
        : user
          ? user.comparePassword(password)
            ? done(null, user)
            : done(null, false, {
              message: 'Incorrect password.'
            })
          : done(null, false, {
            message: 'Unknow username.'
          })
    });
  }));
};
