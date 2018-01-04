const router = require('express').Router();

const profileCtrl = require('../controllers/profile');

module.exports = function (app) {
  router.route('/getUserData/:id?').get(profileCtrl.getUserData);

  router.route('/changePassword').post(profileCtrl.changePassword);

  router.route('/deleteAccount').post(profileCtrl.deleteAccount);

  app.use("/profile", router);
};
