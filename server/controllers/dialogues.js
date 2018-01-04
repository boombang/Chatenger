const User = require('../models/user');
const Friendship = require('../models/friendship');
const PartyDialog = require('../models/partyDialog');

function initDialogues(req, res) {
    let myId = req.user.id,
        queryPromises = [];

    queryPromises.push(Friendship.find({
        $or: [{
                firstFriendId: myId
            }, {
                secondFriendId: myId
            }]
    }))

    queryPromises.push(PartyDialog
        .find({
            "members.id": req.user.id
        })
    );

    Promise.all(queryPromises)
        .then(result => {
            const friendshipResult = result[0],
                partyDialogResult = result[1],
                tatDialoguesId = [],
                tatDialoguesNames = [],
                partyDialoguesId = [],
                partyDialoguesNames = [],
                isCreator = [];

            let queryPromises = [];

            friendshipResult.forEach(note => {
                let queryId;
                note.firstFriendId == myId
                    ? queryId = note.secondFriendId
                    : queryId = note.firstFriendId;
                
                queryPromises.push(User.findById(queryId));
            });

            Promise
                .all(queryPromises)
                .then(result => {
                    result.forEach(note => {
                        tatDialoguesId.push(tatDialoguesId.length + 1);
                        tatDialoguesNames.push(note.login);
                    });
                    res.json({ tatDialoguesId, tatDialoguesNames, partyDialoguesId, partyDialoguesNames, isCreator });
                })
                .catch(err => res.status(404).json(err));


            partyDialogResult.forEach(pd => {
                partyDialoguesId.push(pd._id);
                partyDialoguesNames.push(pd.name);
                isCreator.push(pd.creatorId == myId);
            });
        })
        .catch(err => res.status(404).json(err));
}

function createPartyDialog(req, res) {
    PartyDialog
        .create({
            creatorId: req.user.id,
            name: req.body.name,
            members: [{
                id: req.user.id,
                login: req.user.login
            }]
        })
        .then(result => res.sendStatus(200))
        .catch(err => res.status(404).json({err}));
}

function removePartyDialog(req, res) {
    PartyDialog
        .findByIdAndRemove(req.body.id)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(404).json({err}));
}

function addUserToPartyDialog(req, res) {
    PartyDialog
        .findById(req.body.id)
        .then(dialog => new Promise((res, rej) => {
            User.findOne({ login: req.body.login}, (err, user) => {
                if(err) rej(err);

                user 
                    ? res([
                            dialog, 
                            user
                    ])
                    : rej();
            });
        }))
        .then(result => {
            const dialog = result[0],
            user = result[1];
            dialog.members.push({
                id: user.id,
                login: user.login
            });
            dialog.save(err => {
                if (err) return res.status(404).json(err);
                return res.sendStatus(200);
              });
        })
        .catch(err => res.status(404).json(err));
}

function removeUserFromPartyDialog(req, res) {
    PartyDialog
    .findById(req.body.id)
    .then(dialog => new Promise((res, rej) => {
        User.findOne({ login: req.body.login}, (err, user) => {
            if(err) rej(err);

            user 
                ? res([
                        dialog, 
                        user
                ])
                : rej();
        });
    }))
    .then(result => {
        const dialog = result[0],
        user = result[1],
        i = dialog.members.findIndex(el => el.id == user.id);
        dialog.members.splice(i, 1);
        dialog.save(err => {
            if (err) return res.status(404).json(err);
            return res.sendStatus(200);
        });
    })
    .catch(err => res.status(404).json(err));
}

module.exports = {
    initDialogues,
    createPartyDialog,
    removePartyDialog,
    addUserToPartyDialog,
    removeUserFromPartyDialog
}