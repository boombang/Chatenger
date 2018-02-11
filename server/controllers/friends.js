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
					firstFriend: myId,
				}, {
					secondFriend: myId
				}]
		})
		.populate('firstFriend', 'login')
		.populate('secondFriend', 'login')
		.exec()
		.then(documents => {
			const friends = documents.map(document => {
				let friend = document.firstFriend.id == myId ? document.secondFriend : document.firstFriend;
				return {
					id: friend.id,
					login: friend.login
				}
			});
			
			res.json(friends);
		})
		.catch(err => res.status(404).json(err));
}

function showFriendshipRequests(findStr, populateStr, req, res) {
	FriendshipRequest
		.find({ [findStr]: req.user.id })
		.select(populateStr)
		.populate(populateStr, 'login')
		.exec()
		.then(documents =>  {
			let users = documents.map(document => {
				return {
					id: document[populateStr].id,
					login: document[populateStr].login
				}
			});

			res.json(users)
		})
		.catch(err => res.status(404).json(err));
}

function showFriendshipRequestsToMe(req, res) {
	showFriendshipRequests('userRequestTo', 'userRequestFrom', req, res);
}

function showFriendshipRequestsFromMe(req, res) {
	showFriendshipRequests('userRequestFrom', 'userRequestTo', req, res);
}

function removeFriendship(req, res) {
	if(!req.body.id) return res.status(404).json({err: 'id does not transfered'});

	Friendship
		.findOne({			
			$or: [{
					firstFriend: req.body.id,
					secondFriend: req.user.id
				}, {
						firstFriend: req.user.id,
						secondFriend: req.body.id
				}]
		})
		.exec()
		.then(friendship => {
			if(friendship) return friendship.remove();
		})
		.then(result => res.sendStatus(200))
		.catch(err => res.status(500).json(err));
}

function sendFriendshipRequest(req, res) {
	if(!req.body.id) return res.status(404).json({err: 'id does not transfered'});

	const myId = req.user.id,
			userId = req.body.id;

	FriendshipRequest
		.findOne({
			userRequestFrom: myId,
			userRequestTo: userId
		})
		.exec()
		.then(friendshipRequest => {
			if (!friendshipRequest) {
				return FriendshipRequest
					.create({
						userRequestFrom: myId,
						userRequestTo: userId
					});
			}
		})
		.then(friendshipRequest => {
			if(friendshipRequest) res.sendStatus(200);
		})
		.catch(err => res.status(404).json(err));
}

function cancelFriendshipRequest(isToMe, req, res) {
	if(!req.body.id) return res.status(404).json({err: 'id does not transfered'});

	FriendshipRequest
		.findOne({
			userRequestTo: isToMe ? req.user.id : req.body.id,
			userRequestFrom: isToMe ? req.body.id : req.user.id
		})
		.exec()
		.then(friendshipRequest => {
			if(friendshipRequest) return friendshipRequest.remove();			
		})
		.then(() =>  res.sendStatus(200))
		.catch(err => res.status(404).json(err));
}

function cancelFriendshipRequestFromMe(req, res) {
	cancelFriendshipRequest(false, req, res);
}

function cancelFriendshipRequestToMe(req, res) {
	cancelFriendshipRequest(true, req, res);
}

function confirmFriendshipRequest(req, res) {
	if(!req.body.id) return res.status(404).json({err: 'id does not transfered'});

	const myId = req.user.id,
			userId = req.body.id;

	FriendshipRequest
		.findOne({
			userRequestFrom: userId,
			userRequestTo: myId
		})
		.exec()
		.then(friendshipRequest => {
			if (friendshipRequest) {
				const FriendshipRequestRemove = friendshipRequest.remove();							

				const FriendshipCreate = Friendship.create({
						firstFriend: myId,
						secondFriend: userId
				});

				return Promise.all([FriendshipRequestRemove, FriendshipCreate])
			}
	})
	.then(() => res.sendStatus(200))
	.catch(err => res.status(404).json(err));
}

function showBlackList(req, res) {
	BlackList
		.find({user: req.user.id})
		.populate('blackedUser', 'login')
		.then(documents => {
			let users =  documents.map(document => {
				return {
					id: document.blackedUser.id,
					login: document.blackedUser.login
				}
			});

			res.json(users);
		})
		.catch(err => res.sendStatus(500).json(err));
}


const addToBlackListValidation = [
    check("login").trim().isLength({min: 1, max: 30})
];

async function addToBlackList(req, res) {
	if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});
	
	let queryUserId,
		currentUserId = req.user.id;

	await User
	.findOne({ login: matchedData(req).login })
	.exec()
	.then(user => {
		if(user) queryUserId = user.id;
		else res.status(404).json({ msg: 'user not found' });
	})
	.catch(err => res.status(404).json(err));

	if(res.headersSent) return res;

	await BlackList
		.findOne({
			blackedUser: queryUserId,
			user: currentUserId
		})
		.exec()
		.then(document => {						
			if(!document) {
			const queryPromises = [];

			queryPromises.push(BlackList.create({
					blackedUser: queryUserId,
					user: currentUserId
			}));

			queryPromises.push(Friendship.findOneAndRemove({
				$or: [{
								firstFriend: currentUserId,
								secondFriend: queryUserId
						}, {
								firstFriend: queryUserId,
								secondFriend: currentUserId
						}]
			}));

			queryPromises.push(FriendshipRequest.findOneAndRemove({
				$or: [{
								userRequestTo: currentUserId,
								userRequestFrom: queryUserId
						}, {
								userRequestTo: queryUserId,
								userRequestFrom: currentUserId
						}]
			}));

			return Promise.all(queryPromises);
		}
	})
	.then(result => res.sendStatus(200))
	.catch(err => res.sendStatus(404).json(err));
}

function removeFromBlackList(req, res) {
	if(!req.body.id) return res.status(404).json({err: 'id does not transfered'});

	BlackList
		.findOneAndRemove({
			blackedUser: req.body.id,
			user: req.user.id
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
