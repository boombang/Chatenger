const 
  { check, validationResult } = require('express-validator/check'),
  { matchedData } = require('express-validator/filter'),
  crypto = require("crypto");

const User = require('../models/user');
const Friendship = require('../models/friendship');
const FriendshipRequest = require('../models/friendshipRequest');
const BlackList = require('../models/blackList');

function getUserData(req, res) {
  const myId = req.user.id,
    actualId = req.params.id;
  if (!actualId) {
    res.json({
      userId: req.user.id,
      userLogin: req.user.login
    });
  } else {
    const user = User.findById(actualId, (err, user) => {
      if (err) return res.status(404).json({
        msg: 'database error (User.findById)'
      });

      if (!user) return res.status(404).json({
        msg: 'user not found'
      });

      const userId = user.id;
      Friendship.findOne({
        $or: [
          {
            firstFriendId: myId,
            secondFriendId: userId
          }, {
            firstFriendId: userId,
            secondFriendId: myId
          }
        ]
      }, (err, friendship) => {
        if (err) return res.status(404).json({
          msg: 'database error (Friendship.findOne)'
        });

        if (friendship) return res.json({ id: user.id, login: user.login, userType: "friend" });

        FriendshipRequest.findOne({
          $or: [
            {
              userIdRequestTo: myId,
              userIdRequestFrom: userId
            }, {
              userIdRequestTo: userId,
              userIdRequestFrom: myId
            }
          ]
        }, (err, friendshipRequest) => {
          if (err) return res.status(404).json({
            msg: 'database error (FriendshipRequest.findOne)'
          });

          if (friendshipRequest) {
            return friendshipRequest.userIdRequestTo == myId
              ? res.json({ id: user.id, login: user.login, userType: "frReqToMe" })
              : res.json({ id: user.id, login: user.login, userType: "frReqFromMe" });
          } else {
            BlackList.findOne({
              $or: [
                {
                  userId: myId,
                  blackedUserId: userId
                }, {
                  userId: userId,
                  blackedUserId: myId
                }
              ]
            }, (err, blackListNote) => {
              if (err) return res.status(404).json({
                msg: 'database error (BlackList.findOne)'
              });

              if (blackListNote) {
                return blackListNote.blackedUserId == myId
                  ? res.json({ id: user.id, login: user.login, uBlacked: true })
                  : res.json({ id: user.id, login: user.login, uBlacked: false });
              } else {
                res.json({ id: user.id, login: user.login, userType: "other" })
              }
            });
          }
        });
      })
    });
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
      message: 'Incorrect old password '
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
