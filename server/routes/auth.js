const router = require('express').Router();

const controller = require('../controllers/auth');


module.exports = function (app) {

  router.route('/auth-local').post(controller.authLocal);

  router.route('/signup').post(controller.signUp.validation, controller.signUp.method);

  router.route('/logout').get(controller.logOut);

  app.use("/auth", router);
};
