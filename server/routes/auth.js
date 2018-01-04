const router = require('express').Router();
const passport = require("passport");

const User = require('../models/user');

module.exports = function (app) {

  router.route('/auth-local').post(function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      return err ?
        next(err) :
        user ?
          req.logIn(user, function (err) {
            return err ?
              next(err) :
              res.redirect('/');
          }) :
          res.redirect('/welcome');
    })(req, res, next);
  });

  router.route('/logout').get(function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  });

  app.use("/auth", router);
};
