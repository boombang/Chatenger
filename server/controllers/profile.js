const 
  { check, validationResult } = require('express-validator/check'),
  { matchedData } = require('express-validator/filter'),
  crypto = require("crypto");

const User = require('../models/user');
const Friendship = require('../models/friendship');
const FriendshipRequest = require('../models/friendshipRequest');
const BlackList = require('../models/blackList');

// function getUserData(req, res) {
//   const myId = req.user.id,
//     actualId = req.params.id;
//   if (!actualId) {
//     return res.json({
//       userId: req.user.id,
//       userLogin: req.user.login
//     });
//   } else {
//     if(Number(actualId) < 1) return res.status(404).json({err: 'invalid id'});
//     User
//       .findById(actualId)
//       .catch(err => res.status(500).json({ msg: 'database error (User.findById)' }))
//       .then(user => {
//         if (!user) return res.status(404).json({ msg: 'user not found' });

//         const userId = user.id;
//          Friendship
//           .findOne({
//             $or: [
//               {
//                 'firstFriend.id': myId,
//                 'secondFriend.id': userId
//               }, {
//                 'firstFriend.id': userId,
//                 'secondFriend.id': myId
//               }
//             ]
//           })
//           .exec()
//           .catch(err => res.status(500).json({ msg: 'database error (Friendship.findOne)' }))
//           .then(friendship => {
//             if (friendship) return res.json({ id: user.id, login: user.login, userType: "friend" });

//             FriendshipRequest.findOne({
//               $or: [
//                 {
//                   'userRequestTo.id': myId,
//                   'userRequestFrom.id': userId
//                 }, {
//                   'userRequestTo.id': userId,
//                   'userRequestFrom.id': myId
//                 }
//               ]
//             })
//             .catch(err => res.status(404).json({ msg: 'database error (FriendshipRequest.findOne)' }))
//             .then(friendshipRequest => {
//               if (friendshipRequest) {
//                 return friendshipRequest.userIdRequestTo == myId
//                   ? res.json({ id: user.id, login: user.login, userType: "frReqToMe" })
//                   : res.json({ id: user.id, login: user.login, userType: "frReqFromMe" });
//               } else {
//                 BlackList
//                   .findOne({
//                     $or: [{
//                         'user.id': myId,
//                         'blackedUser.id': userId
//                       }, {
//                         'user.id': userId,
//                         'blackedUser.id': myId
//                       }]
//                 })
//                 .catch(err => res.status(404).json({ msg: 'database error (BlackList.findOne)' }))
//                 .then(blackListNote => {
//                   if (blackListNote) {
//                     return blackListNote.blackedUserId == myId
//                       ? res.json({ id: user.id, login: user.login, uBlacked: true })
//                       : res.json({ id: user.id, login: user.login, uBlacked: false });
//                   } else {
//                     res.json({ id: user.id, login: user.login, userType: "other" })
//                   }
//                 })
//               }
//             })
//           })
//       })
//   }
// }

// function getUserData(req, res) {
//   const myId = req.user.id,
//     actualId = req.params.id;
//   if (!actualId) {
//     return res.json({
//       userId: req.user.id,
//       userLogin: req.user.login
//     });
//   } else {
//     if(Number(actualId) < 1) return res.status(404).json({err: 'invalid id'});

//     let userId;
    
//     User
//       .findById(actualId)
//       .catch(err => res.status(500).json({ msg: 'database error (User.findById)' }))
//       .then(user => {
//         if (!user) return res.status(404).json({ msg: 'user not found' });

//         userId = user.id;
//         return Friendship
//           .findOne({
//             $or: [
//               {
//                 'firstFriend.id': myId,
//                 'secondFriend.id': userId
//               }, {
//                 'firstFriend.id': userId,
//                 'secondFriend.id': myId
//               }
//             ]
//           })
//           .exec();
//       })
//       .catch(err => res.status(500).json({ msg: 'database error (Friendship.findOne)' }))
//       .then(friendship => {
//         if (friendship) {
//           return res.json({
//             id: user.id,
//             login: user.login,
//             userType: "friend"
//           });
//         }

//         return FriendshipRequest.findOne({
//           $or: [
//             {
//               'userRequestTo.id': myId,
//               'userRequestFrom.id': userId
//             }, {
//               'userRequestTo.id': userId,
//               'userRequestFrom.id': myId
//             }
//           ]
//         }).exec();
//       })
//       .catch(err => {
//         res.status(405).json({ msg: 'database error (FriendshipRequest.findOne)' })
//       })
//       // .catch(err => res.status(405).json({ err }))
//       .then(friendshipRequest => {
//           if (friendshipRequest) {
//             return friendshipRequest.userIdRequestTo == myId
//               ? res.json({ id: user.id, login: user.login, userType: "frReqToMe" })
//               : res.json({ id: user.id, login: user.login, userType: "frReqFromMe" });
//           } else {
//             return BlackList
//               .findOne({
//                 $or: [{
//                     'user.id': myId,
//                     'blackedUser.id': userId
//                   }, {
//                     'user.id': userId,
//                     'blackedUser.id': myId
//                   }]
//               }).exec();
//           }
//       })
//       .catch(err => res.status(404).json({ msg: 'database error (BlackList.findOne)' }))
//       .then(blackListNote => {
//         if (blackListNote) {
//           return blackListNote.blackedUserId == myId
//             ? res.json({ id: user.id, login: user.login, uBlacked: true })
//             : res.json({ id: user.id, login: user.login, uBlacked: false });
//         } else {
//           res.json({ id: user.id, login: user.login, userType: "other" })
//         }
//       })
//   }
// }

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
