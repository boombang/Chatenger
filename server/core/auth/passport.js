"use strict";

const passport = require("passport");
// const path = require("path");

const User = require("../../models/user");

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      err
        ? done(err)
        : done(null, user);
    });
  });

  console.log("Search passport strategies...");

  // function requireAll(r) {
  //   return r.keys().map(function (module) {
  //     console.log("Loading passport strategy file " + path.basename(module) + "...");
  //     let strategy = r(module);
  //     strategy();

  //     return strategy;
  //   });
  // }
  // let modules = requireAll(require.context("./strategies", true, /\.js$/));
  require('./strategies/local.js')();
};
