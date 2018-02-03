const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const User = require('../models/user');
const Friendship = require('../models/friendship');
const FriendshipRequest = require('../models/friendshipRequest');
const BlackList = require('../models/blackList');

function getFriends(req, res) {
	const myId = req.user.id;
	
	Friendship
		.find({
			$or: [{
					'firstFriend.id': myId,
				}, {
					'secondFriendId.id': myId
				}]
		})
		.exec()
		.then(result => {
			const friends = result.map(note => note.firstFriend.id == myId ? note.secondFriend : note.firstFriend);
			
			return res.json({ friends });
		})
		.catch(err => res.status(404).json({ err }));
}

function showFriendshipRequestsToMe(req, res) {
	const myId = req.user.id;
	
	FriendshipRequest
		.find({
				'userRequestTo.id': myId
		})
		.select('userRequestFrom')
		.exec()
		.then(users =>  res.json({ users }))
		.catch(err => res.status(404).json({ err }));
}

function showFriendshipRequestsFromMe(req, res) {
	const myId = req.user.id;
		
  FriendshipRequest
		.find({
			'userRequestFrom.id': myId
		})
		.select('userRequestTo')
		.exec()
		.then(users => res.json({ users }))
		.catch(err => res.status(404).json({ err }));
}

function removeFriendship(req, res) {
	if(req.body.id && Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

	Friendship
		.findOne({			
			$or: [{
					'firstFriend.id': req.body.id,
					'secondFriend.id': req.user.id
				}, {
						'firstFriend.id': req.user.id,
						'secondFriend.id': req.body.id
				}]
		})
		.exec()
		.catch(er => res.status(500).json({ err }))
		.then(friendship => {
			if(friendship) return Friendship.remove(friendship);
			else return res.sendStatus(404);
		})
		.catch(err => res.status(500).json({ err }))
		.then(result => res.sendStatus(200));
}

function sendFriendshipRequest(req, res) {
	const myId = req.user.id,
			userId = req.body.id;

	if(userId && Number(userId) < 1) return res.status(404).json({err: 'invalid id'});

	FriendshipRequest
		.findOne({
			'userRequestFrom.id': myId,
			'userRequestTo.id': userId
		})
		.exec()
		.catch(err => res.sendStatus(404).json({ msg: 'database error' }))
		.then(friendshipRequest => {
			if (friendshipRequest) {
				return res.sendStatus(404).json({
						msg: 'friendshipRequest already exist'
				});
			} else {
				return FriendshipRequest
					.create({
						userIdRequestFrom: myId,
						userIdRequestTo: userId
					});
			}
		})
		.catch(err => res.status(404).json({ msg: 'database error' }))
		.then(friendshipRequest => res.sendStatus(200));
}

function cancelFriendshipRequestFromMe(req, res) {
    if(req.body.id && Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

		FriendshipRequest
			.findOne({
        'userRequestTo.id': req.body.id,
        'userRequestFrom.id': req.user.id
			})
			.exec()
			.catch(err =>  res.status(404).json({ err }))
			.then(friendshipRequest => {
				if(friendshipRequest) return FriendshipRequest.remove(friendshipRequest)
				else return res.sendStatus(404);				
			})
			.catch(err => res.status(404).json({ err }))
			.then(result => res.sendStatus(200));
}

function cancelFriendshipRequestToMe(req, res) {
    if(req.body.id && Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

		FriendshipRequest
			.findOne({
        'userRequestTo.id': req.user.id,
        'userRequestFrom.id': req.body.id
			})
			.exec()
			.catch(err => res.status(404).json({ err }))
			.then(friendshipRequest => {
				if(friendshipRequest) return FriendshipRequest.remove(friendshipRequest)
				else return res.sendStatus(404);					
			})
			.catch(err => res.status(404).json({ err }))
			.then(result => res.sendStatus(200));
}

function confirmFriendshipRequest(req, res) {
    const myId = req.user.id,
        userId = req.body.id;

    if(userId && Number(userId) < 1) return res.status(404).json({err: 'invalid id'});

		FriendshipRequest
			.findOne({
        'userRequestFrom.id': userId,
        'userRequestTo.id': myId
			})
			.exec()
			.catch(err => res.sendStatus(404).json({ msg: 'database error' }))
			.then(friendshipRequest => {
				if (friendshipRequest) {
					const FriendshipRequestRemove = FriendshipRequest.remove({
							'userRequestFrom.id': userId,
							'userIdRequestTo.id': myId
					});

					const FriendshipCreate = Friendship.create({
							firstFriend: {
								id: myId,
								login: req.user.login
							},
							secondFriend: {
								id: userId,
								login: friendshipRequest.userRequestFrom.id
							}
					}).exec();

					return Promise.all([FriendshipRequestRemove, FriendshipCreate])
			} else return res.status(404).json({ msg: 'friendshipRequest already not exist' });
		})
		.catch(() => res.status(404).json({ msg: 'database error' }))
		.then(() => res.sendStatus(200));
}

function showBlackList(req, res) {
	BlackList
		.find({
			'user.id': req.user.id
		})
		.then(result => {
				return result.map(note => users.push({
					id: note.blackedUser.id,
					login: note.blackedUser.login
				}));
		})
		.catch(err => res.sendStatus(500).json({ msg: 'database error' }));
}


const addToBlackListValidation = [
    check("login").trim().isLength({min: 1, max: 30})
];

function addToBlackList(req, res) {
    if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

		User
		.findOne({
        login: matchedData(req).login
		})
		.exec()
		.catch(err => res.sendStatus(404).json({ msg: 'database error' }))
		.then(user => {
			if(user) {
				const myId = req.user.id,
						userId = user.id;

				return BlackList
					.findOne({
						'blackedUser.id': userId,
						'user.id': myId
					})
					.exec();
			} else return res.status(404).json({ msg: 'user not found' });
		})
		.catch(err => res.sendStatus(404).json({ msg: 'database error' }))
		.then(result => {						
					if(!result) {
					const queryPromises = [];

					queryPromises.push(BlackList.create({
							blackedUser: {
								id: userId,
								login: user.login
							},
							user: {
								id: myId,
								login: req.user.login
							}
					}));

					queryPromises.push(Friendship.findOneAndRemove({
						$or: [{
										'firstFriend.id': myId,
										'secondFriend.id': userId
								}, {
										'firstFriend.id': userId,
										'secondFriend.id': myId
								}]
					}));

					queryPromises.push(FriendshipRequest.findOneAndRemove({
							$or: [{
											'userRequestTo.id': myId,
											'userRequestFrom.id': userId
									}, {
											'userRequestTo.id': userId,
											'userRequestFrom.id': myId
									}]
					}));

					Promise.all(queryPromises)
							.then(result => res.sendStatus(200))
							.catch(err => res.status(404).json({ err }));
			}
			else return result => res.sendStatus(200);//уже добавили
		})
		.catch(err => res.sendStatus(404).json({ msg: 'database error' }))
}

function removeFromBlackList(req, res) {
    if(req.body.id && Number(req.body.id) < 1) return res.status(404).json({err: 'invalid id'});

		BlackList
			.findOneAndRemove({
        'blackedUser.id': req.body.id,
        'user.id': req.user.id
			})
			.then(() => res.sendStatus(200))
			.catch(err => res.status(500).json({ err }))
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
