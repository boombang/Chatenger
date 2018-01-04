const router = require('express').Router();

const friendsCtrl = require('../controllers/friends');

module.exports = function (app) {
    router.route('/getFriends').get(friendsCtrl.getFriends);

    router.route('/sendFriendshipRequest').post(friendsCtrl.sendFriendshipRequest);

    router.route('/confirmFriendshipRequest').post(friendsCtrl.confirmFriendshipRequest);

    router.route('/showFriendshipRequestsToMe').get(friendsCtrl.showFriendshipRequestsToMe);

    router.route('/showFriendshipRequestsFromMe').get(friendsCtrl.showFriendshipRequestsFromMe);

    router.route('/cancelFriendshipRequestFromMe').post(friendsCtrl.cancelFriendshipRequestFromMe);

    router.route('/cancelFriendshipRequestToMe').post(friendsCtrl.cancelFriendshipRequestToMe);

    router.route('/removeFriendship').post(friendsCtrl.removeFriendship);

    router.route('/showBlackList').get(friendsCtrl.showBlackList);

    router.route('/addToBlackList').post(friendsCtrl.addToBlackList);

    router.route('/removeFromBlackList').post(friendsCtrl.removeFromBlackList);
    
    app.use("/friends", router);
};
