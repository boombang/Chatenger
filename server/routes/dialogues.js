const router = require('express').Router();
const controller = require('../controllers/dialogues');

module.exports = function (app) {
    router.route('/initDialogues').get(controller.initDialogues);

    router.route('/createPartyDialog').post(controller.createPartyDialog.validation, controller.createPartyDialog.method);

    router.route('/removePartyDialog').post(controller.removePartyDialog);

    router.route('/addUserToPartyDialog').post(controller.addUserToPartyDialog.validation, controller.addUserToPartyDialog.method);

    router.route('/removeUserFromPartyDialog').post(controller.removeUserFromPartyDialog.validation, controller.removeUserFromPartyDialog.method);
    
    app.use("/dialogues", router);
};
