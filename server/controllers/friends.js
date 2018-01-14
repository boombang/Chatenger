const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const User = require('../models/user');
const Friendship = require('../models/friendship');
const FriendshipRequest = require('../models/friendshipRequest');
const BlackList = require('../models/blackList');

function getFriends(req, res) {
    const myId = req.user.id;
    Friendship.find({
        $or: [
            {
                firstFriendId: myId,
            }, {
                secondFriendId: myId
            }
        ]
    })
        .then(result => {
            const friendsId = result.map(note => note.firstFriendId == myId ? note.secondFriendId : note.firstFriendId);
            let friends = [], queryPromises = [];
            
            friendsId.forEach(friendId => {
                queryPromises.push(User.findById(friendId));
            });

            Promise.all(queryPromises)
                .then(results => {
                    results.forEach(result => friends.push({
                        id: result.id,
                        login: result.login
                    }));
                    return res.json({
                       friends
                    });
                })
        })
        .catch(err => res.status(404).json({err}));
}

function showFriendshipRequestsToMe(req, res) {
    const myId = req.user.id;
    FriendshipRequest
        .find({
            userIdRequestTo: myId
        })
        .select('userIdRequestFrom')
        .exec((err, results) => {
            if(err) return res.status(404).json({
                err
            });
    
            let users = [], queryPromises = [];
                
            results.forEach(result => {
                queryPromises.push(User.findById(result.userIdRequestFrom));
            });
    
            Promise.all(queryPromises)
                .then(results => {
                    results.forEach(result => users.push({
                        id: result.id,
                        login: result.login
                    }));
                    return res.json({
                        users
                    });
                })
                .catch(err => console.log(err));
          });
}

function showFriendshipRequestsFromMe(req, res) {
    const myId = req.user.id;
    FriendshipRequest
        .find({
            userIdRequestFrom: myId
        })
        .select('userIdRequestTo')
        .exec((err, results) => {
            if(err) return res.status(404).json({
                err
            });
    
            let users = [], queryPromises = [];
                
            results.forEach(result => {
                queryPromises.push(User.findById(result.userIdRequestTo));
            });
    
            Promise.all(queryPromises)
                .then(results => {
                    results.forEach(result => users.push({
                        id: result.id,
                        login: result.login
                    }));
                    return res.json({
                        users
                    });
                })
                .catch(err => console.log(err));
          });
}

function removeFriendship(req, res) {
    if(Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

    Friendship.findOne({
        $or: [{
                firstFriendId: req.body.id,
                secondFriendId: req.user.id
            }, {
                firstFriendId: req.user.id,
                secondFriendId: req.body.id
            }
        ]
    }, (err, friendship) => {
    if (err) return res.status(404).json({
        err
        });

        if(friendship) {
        Friendship.remove(friendship, (err, result) => {
            if (err) return res.status(404).json({
                err
                });
                return res.sendStatus(200);
        });
        }
        else {
            return res.sendStatus(404);
        }
    });
}

function sendFriendshipRequest(req, res) {
    const myId = req.user.id,
        userId = req.body.id;

    if(Number(userId) < 1) return res.status(404).json({err: 'invalid id'});

    FriendshipRequest.findOne({
        userIdRequestFrom: myId,
        userIdRequestTo: userId
    }, (err, friendshipRequest) => {
        if (err) return res.sendStatus(404).json({
            msg: 'database error'
        });
        if (friendshipRequest) {
            return res.sendStatus(404).json({
                msg: 'friendshipRequest already exist'
            });
        } else {
            FriendshipRequest.create({
                userIdRequestFrom: myId,
                userIdRequestTo: userId
            }, (err, friendshipRequest) => {
                if (err) {
                    return res.status(404).json({
                        msg: 'database error'
                    });
                }
                return res.sendStatus(200);
            })
        }
    });
}

function cancelFriendshipRequestFromMe(req, res) {
    if(Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

    FriendshipRequest.findOne({
            userIdRequestTo: req.body.id,
            userIdRequestFrom: req.user.id
        }, (err, friendshipRequest) => {
        if (err) return res.status(404).json({
            err
            });

            if(friendshipRequest) {
            FriendshipRequest.remove(friendshipRequest, (err, result) => {
                if (err) return res.status(404).json({
                    err
                    });
                    return res.sendStatus(200);
            });
            }
            else {
                return res.sendStatus(404);
            }
        });
}

function cancelFriendshipRequestToMe(req, res) {
    if(Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

    FriendshipRequest.findOne({
        userIdRequestTo: req.user.id,
        userIdRequestFrom: req.body.id
    }, (err, friendshipRequest) => {
        if (err) return res.status(404).json({
            err
        });

        if(friendshipRequest) {
        FriendshipRequest.remove(friendshipRequest, (err, result) => {
            if (err) return res.status(404).json({
                err
                });
                return res.sendStatus(200);
        });
        }
        else {
            return res.sendStatus(404);
        }
    });
}

function confirmFriendshipRequest(req, res) {
    const myId = req.user.id,
        userId = req.body.id;

    if(Number(userId) < 1) return res.status(404).json({err: 'invalid id'});

    FriendshipRequest.findOne({
        userIdRequestFrom: userId,
        userIdRequestTo: myId
    }, (err, friendshipRequest) => {
        if (err) return res.sendStatus(404).json({
            msg: 'database error'
        });
        if (friendshipRequest) {
            const FriendshipRequestRemove = FriendshipRequest.remove({
                userIdRequestFrom: userId,
                userIdRequestTo: myId
            }).exec();

            const FriendshipCreate = Friendship.create({
                firstFriendId: myId,
                secondFriendId: userId
            });

            Promise.all([FriendshipRequestRemove, FriendshipCreate])
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch(() => {
                    return res.status(404).json({
                        msg: 'database error'
                    });
                })

        } else {
            return res.status(404).json({
                msg: 'friendshipRequest already not exist'
            });
        }
    });

}

function showBlackList(req, res) {
    BlackList.find({
        userId: req.user.id
    }, (err, result) => {
        if (err) return res.sendStatus(404).json({
            msg: 'database error'
        });
        let users = [], queryPromises = [];

        result.forEach(blackNote => {
            queryPromises.push(User.findById(blackNote.blackedUserId));
        });

        Promise.all(queryPromises)
            .then(results => {
                results.forEach(result => users.push({
                    id: result.id,
                    login: result.login
                }));

                return res.json({
                    users
                });
            })
            .catch(err => res.status(404).json(err))
    })
}


const addToBlackListValidation = [
    check("login").trim().isLength({min: 1, max: 30})
];

function addToBlackList(req, res) {
    if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

    User.findOne({
        login: matchedData(req).login
    }, (err, result) => {
        if (err) return res.sendStatus(404).json({
            msg: 'database error'
        });

        if(result) {
            const myId = req.user.id,
                userId = result.id;
            BlackList.findOne({
                blackedUserId: userId,
                userId: myId
            }, (err, result) => {
                if (err) return res.sendStatus(404).json({
                    msg: 'database error'
                });
                
                if(!result) {
                    const queryPromises = [];

                    queryPromises.push(BlackList.create({
                        blackedUserId: userId,
                        userId: myId
                    }));

                    queryPromises.push(Friendship.findOneAndRemove({
                        $or: [{
                                firstFriendId: myId,
                                secondFriendId: userId
                            }, {
                                firstFriendId: userId,
                                secondFriendId: myId
                            }]
                    }));

                    queryPromises.push(FriendshipRequest.findOneAndRemove({
                        $or: [{
                                userIdRequestTo: myId,
                                userIdRequestFrom: userId
                            }, {
                                userIdRequestTo: userId,
                                userIdRequestFrom: myId
                            }]
                    }));

                    Promise.all(queryPromises)
                        .then(result => res.sendStatus(200))
                        .catch(err => res.status(404).json({err}));
                }
            });
        }
    })
}

function removeFromBlackList(req, res) {
    if(Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

    BlackList.findOneAndRemove({
        blackedUserId: req.body.id,
        userId: req.user.id
    }, (err, result) => {
        return result
            ? res.sendStatus(200)
            : res.sendStatus(404);
    });
}

module.exports = {
    getFriends,
    confirmFriendshipRequest,
    sendFriendshipRequest,
    showFriendshipRequestsToMe,
    showFriendshipRequestsFromMe,
    cancelFriendshipRequestFromMe,
    cancelFriendshipRequestToMe,
    removeFriendship,
    showBlackList,
    addToBlackList: {
        validation: addToBlackListValidation,
        method: addToBlackList
    },
    removeFromBlackList
}
