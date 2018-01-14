const router = require('express').Router();

const controller = require('../controllers/friends');

module.exports = function (app) {
    router.route('/getFriends').get(controller.getFriends);

    router.route('/sendFriendshipRequest').post(controller.sendFriendshipRequest);

    router.route('/confirmFriendshipRequest').post(controller.confirmFriendshipRequest);

    router.route('/showFriendshipRequestsToMe').get(controller.showFriendshipRequestsToMe);

    router.route('/showFriendshipRequestsFromMe').get(controller.showFriendshipRequestsFromMe);

    router.route('/cancelFriendshipRequestFromMe').post(controller.cancelFriendshipRequestFromMe);

    router.route('/cancelFriendshipRequestToMe').post(controller.cancelFriendshipRequestToMe);

    router.route('/removeFriendship').post(controller.removeFriendship);

    router.route('/showBlackList').get(controller.showBlackList);

    router.route('/addToBlackList').post(controller.addToBlackList.validation, controller.addToBlackList.method);

    router.route('/removeFromBlackList').post(controller.removeFromBlackList);
    
    app.use("/friends", router);
};
