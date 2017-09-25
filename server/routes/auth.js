const router = require('express').Router();
const passport = require("passport");

const User = require('../models/user');

module.exports = function (app) {

  // router.route('/auth-local').post(function (req, res, next) {
  //   passport.authenticate("local", function (err, user, info) {
  //     return err ?
  //       next(err) :
  //       user ?
  //       req.logIn(user, function (err) {
  //         return err ?
  //           next(err) :
  //           res.sendStatus(200);
  //       }) :
  //       res.sendStatus(404);
  //   })(req, res, next);
  // });

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
  });

  // router.route('/signup').post(function (req, res) {
  //   req.check("login").notEmpty();
  //   req.check("email").notEmpty();
  //   req.check("email").isEmail();
  //   // req.sanitize("email").normalizeEmail({
  //   //   remove_dots: false
  //   // });
  //   req.check("password").notEmpty();
  //   req.check("confirmPassword").notEmpty();

  //   let errors = req.validationErrors();

  //   if (errors) {
  //     console.log(errors);
  //     return res.sendStatus(404);
  //   }

  //   const user = User.findOne({
  //     login: req.body.login
  //   }, function (err, user) {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     if (!user) {
  //       User.create({
  //         login: req.body.login,
  //         password: req.body.password,
  //         email: req.body.email
  //       }, function (err, user) {
  //         if (err) {
  //           res.json({
  //             message: err
  //           });
  //         }
  //         res.json({
  //           message: 'hey'
  //         });
  //       });
  //     }
  //   });
  // });

  app.use("/auth", router);
}
