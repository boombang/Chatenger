const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const User = require('../models/user');
const Friendship = require('../models/friendship');
const PartyDialog = require('../models/partyDialog');

function initDialogues(req, res) {
    let myId = req.user.id,
        queryPromises = [];

    queryPromises.push(Friendship.find({
        $or: [{
                firstFriend: myId
            }, {
                secondFriend: myId
            }]
    })
    .populate('firstFriend', 'login')
    .populate('secondFriend', 'login')
)

    queryPromises.push(PartyDialog
        .find({
            members: req.user.id
        })
        .populate('creator', 'id')
    );

    Promise.all(queryPromises)
        .then(documents => {
            const friendships = documents[0],
                partyDialogues = documents[1],
                tatDialoguesId = [],
                tatDialoguesNames = [],
                partyDialoguesId = [],
                partyDialoguesNames = [],
                isCreator = [];

            let queryPromises = [];

            friendships.forEach(friendship => {
                tatDialoguesId.push(friendship.id);
                let tatDialogName = friendship.firstFriend.id == myId
                    ? friendship.secondFriend.login
                    : friendship.firstFriend.login;
                tatDialoguesNames.push(tatDialogName);
            });

            partyDialogues.forEach(partyDialog=> {
                partyDialoguesId.push(partyDialog.id);
                partyDialoguesNames.push(partyDialog.name);
                isCreator.push(partyDialog.creator.id == myId);
            });

            res.json({ tatDialoguesId, tatDialoguesNames, partyDialoguesId, partyDialoguesNames, isCreator });
        })
        .catch(err => res.status(404).json(err));
}

const createPartyDialogValidation = [
    check("name").trim().isLength({min: 1, max: 30})
];

function createPartyDialog(req, res) {
	if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

	PartyDialog
		.create({
				creator: req.user.id,
				name: matchedData(req).name
		})
		.then(partyDialog => {
			partyDialog.members.push(req.user.id);
			partyDialog.save();
		})
		.then(() => res.sendStatus(200))
		.catch(err => res.status(404).json({err}));
}

function removePartyDialog(req, res) {
	if(!req.body.id) return res.status(404).json({err: 'invalid id'});
	
	PartyDialog
		.findById(req.body.id)
		.populate('creator', 'id')
		.then(partyDialog => {
			if(partyDialog.creator.id === req.user.id) return partyDialog.remove();			
		})
		.then(result => res.sendStatus(200))
		.catch(err => res.status(404).json({err}));
}

const addUserToPartyDialogValidation = [
    check("id").exists(),
    check("login").trim().isLength({min: 1, max: 30})
];

function addUserToPartyDialog(req, res) {
	if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

	let partyDialog, user;
	
	PartyDialog
		.findById(matchedData(req).id)
		.populate('creator', 'id')
		.then(document => {
			partyDialog = document;
			if(partyDialog && partyDialog.creator.id === req.user.id) {
				return User.findOne({login: matchedData(req).login})
			}
		})
		.then(document => {
			user = document;

			if(user) {
				partyDialog.members.push(user.id);
				partyDialog.save();
			}
		})
		.then(() => res.sendStatus(200))
		.catch(err => res.status(404).json(err));
}

const removeUserFromPartyDialogValidation = [
    check("id").exists(),
    check("login").trim().isLength({min: 1, max: 30})
];

function removeUserFromPartyDialog(req, res) {
	if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

	let partyDialog, user;

	PartyDialog
		.findById(matchedData(req).id)
		.populate('creator', 'id')
		.then(document => {
			partyDialog = document;
			if(partyDialog && partyDialog.creator.id === req.user.id) {
				return User.findOne({login: matchedData(req).login})
			}
		})
		.then(document => {
			user = document;

			if(user) {
				let userIndexInPartyDialog = partyDialog.members.indexOf(user.id);
				if(userIndexInPartyDialog) {
					partyDialog.members.splice(userIndexInPartyDialog, 1);
					return partyDialog.save();
				}
			}
		})
		.then(() => res.sendStatus(200))
		.catch(err => res.status(404).json(err));
}

module.exports = {
    initDialogues,
    createPartyDialog: {
        validation: createPartyDialogValidation,
        method: createPartyDialog
    },
    removePartyDialog,
    addUserToPartyDialog: {
        validation: addUserToPartyDialogValidation,
        method: addUserToPartyDialog
    },
    removeUserFromPartyDialog: {
        validation: removeUserFromPartyDialogValidation,
        method: removeUserFromPartyDialog
    }
}