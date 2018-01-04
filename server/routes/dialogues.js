const router = require('express').Router();
const controller = require('../controllers/dialogues');

module.exports = function (app) {
    router.route('/initDialogues').get(controller.initDialogues);

    router.route('/createPartyDialog').post(controller.createPartyDialog);

    router.route('/removePartyDialog').post(controller.removePartyDialog);

    router.route('/addUserToPartyDialog').post(controller.addUserToPartyDialog);

    router.route('/removeUserFromPartyDialog').post(controller.removeUserFromPartyDialog);
    
    app.use("/dialogues", router);
};
