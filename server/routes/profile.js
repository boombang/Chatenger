const router = require('express').Router();

const controller = require('../controllers/profile');

module.exports = function (app) {
  router.route('/getUserData/:login?').get(controller.getUserData);

  router.route('/changePassword').post(controller.changePassword.validation, controller.changePassword.method);

  router.route('/deleteAccount').post(controller.deleteAccount.validation, controller.deleteAccount.method);

  app.use("/profile", router);
};
