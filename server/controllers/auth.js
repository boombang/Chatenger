const passport = require("passport");
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const User = require('../models/user');

function authLocal(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    return err ?
      next(err) :
        user
          ? req.logIn(user, function (err) {
            return err ?
              next(err) :
              res.redirect('/');
            })
          : res.redirect('/welcome');
  })(req, res, next);
}

const signUpValidation = [
	check("login").trim().isLength({min: 1, max: 30}),
	check(["password", "confirmPassword"]).isLength({min: 1, max: 40}),
	check("email").trim().isEmail().isLength({min: 1, max: 129})
];

function signUp(req, res) {
    if (!validationResult(req).isEmpty()) return res.redirect('/');

    User
      .findOne({ login: matchedData(req).login })
      .exec()
      .catch(err => res.redirect('/'))
      .then(user => {
        if (!user) {
          const bodyData = matchedData(req);
          return User.create({
            login: bodyData.login,
            password:bodyData.password,
            email: bodyData.email
          });
        } else return res.redirect('/');
      })
      .then(() => res.redirect('/'))
      .catch(err => res.redirect('/'));
  }

  function logOut(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  }

  module.exports = {
      authLocal,
      signUp: {
				method: signUp,
				validation: signUpValidation
			},
      logOut
  }