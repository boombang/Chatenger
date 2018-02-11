const 
  { check, validationResult } = require('express-validator/check'),
  { matchedData } = require('express-validator/filter'),
  crypto = require("crypto"),
  mongoose = require('mongoose'),

  User = require('../models/user');
  Friendship = require('../models/friendship');
  FriendshipRequest = require('../models/friendshipRequest');
  BlackList = require('../models/blackList');

async function getUserData(req, res) {
  const actualLogin = req.params.login;
  if (!actualLogin) {
    return res.json({
      userId: req.user.id,
      userLogin: req.user.login
    });
  } else {
    let currentId = req.user.id,
      queryUser;
    
    await User
      .findOne({ login: actualLogin })
      .select('id login')
      .then(user => {
        if (!user) res.status(404).json({ msg: 'user not found' });
        else queryUser = user;
      })
      .catch(err => res.status(400).json(err));

      if(res.headersSent) return res;

      await Friendship
        .findOne({
          $or: [
            {
              firstFriend: currentId,
              secondFriend: queryUser.id
            }, {
              firstFriend: queryUser.id,
              secondFriend: currentId
            }
          ]
        })
        .exec()
        .then(friendship => {
          if (friendship) {
            res.json({
              id: queryUser.id,
              login: queryUser.login,
              userType: "friend"
            });
          }
        })
        .catch(err => res.status(400).json(err));

      if(res.headersSent) return res;

      await FriendshipRequest.findOne({
        $or: [
          {
            userRequestTo: currentId,
            userRequestFrom: queryUser.id
          }, {
            userRequestTo: queryUser.id,
            userRequestFrom: currentId
          }
        ]
      })
      .populate('userRequestTo', 'id')
      .exec()
      .then(friendshipRequest => {
          if (friendshipRequest) {
            let json = { 
              id: queryUser.id, 
              login: queryUser.login
            }

            friendshipRequest.userRequestTo.id === currentId
              ? json.userType = 'frReqToMe'
              : json.userType = 'frReqFromMe';

            res.json(json);
          }
      })
      .catch(err => res.status(400).json(err));

      if(res.headersSent) return res;

      await BlackList
        .findOne({
          $or: [{
              user: currentId,
              blackedUser: queryUser.id
            }, {
              user: queryUser.id,
              blackedUser: currentId
            }]
        })
        .populate('blackedUser', 'id')
        .exec()
        .then(blackListNote => {
          let json = {
            id: queryUser.id, 
            login: queryUser.login
          }
          if (blackListNote) {
            blackListNote.blackedUser.id == currentId
              ? json.uBlacked = true
              : json.uBlacked = false;
          }
          else json.userType = 'other';

          res.json(json);
        })
        .catch(err => res.status(400).json(err));
  }
}

const changePasswordValidation = [
	check(["oldPassword", "newPassword", "confirmNewPassword"]).isLength({min: 1, max: 40}),
];

function changePassword(req, res) {
  if (!validationResult(req).isEmpty()) return res.status(404).json({err: validationResult.array()});

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return res.status(422).json({
      message: 'Passwords do not match'
    });
  }

  if (crypto.pbkdf2Sync(req.body.oldPassword, req.user.salt, 10000, 512, 'sha512') != req.user.password) {
    return res.status(422).json({
      message: 'Incorrect old password'
    });
  }

  const
    salt = crypto.randomBytes(128).toString('base64'),
    password = crypto.pbkdf2Sync(req.body.newPassword, salt, 10000, 512, 'sha512');

  User.update(
    { _id: req.user.id },
    { salt, password },
    (err, result) => {
      err ? res.sendStatus(404) : res.sendStatus(200);
    }
  );
}

const deleteAccountValidation = [
	check(["password", "confirmNewPassword"]).isLength({min: 1, max: 40}),
];

function deleteAccount(req, res) {
  if (!validationResult(req).isEmpty()) 
    return res.render('index');

  if (req.body.password !== req.body.confirmPassword) 
    return res.render('index');
  
  if (crypto.pbkdf2Sync(req.body.password, req.user.salt, 10000, 512, 'sha512') != req.user.password) 
    return res.render('index');

  User.remove({ _id: req.user.id }, err => {
    if (err) {
      return res.render('index');
    } else {
      req.logout();
      req.session.destroy();
      res.redirect("/welcome");
    }
  });
}

module.exports = {
  getUserData,
  changePassword: {
    validation: changePasswordValidation,
    method: changePassword
  },
  deleteAccount: {
    validation: deleteAccountValidation,
    method: deleteAccount
  }
}
