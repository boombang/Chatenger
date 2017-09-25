"use strict";

let bcrypt = require("bcrypt-nodejs");
let crypto = require("crypto");
let mongoose = require("mongoose");
let autoIncrement = require("mongoose-auto-increment");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  // id: Schema.Types.ObjectId,
  login: {
    type: String,
    required: true,
    maxlength: 30,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: Buffer,
  },
  email: {
    type: String,
    required: true,
    maxlength: 129,
    unique: true
  }
}, {
  versionKey: false
});

/**
 * Virtual `code` field instead of _id
 */
UserSchema.virtual("code").get(function () {
  return this.encodeID();
});

/**
 * Auto increment for `_id`
 */
UserSchema.plugin(autoIncrement.plugin, {
  model: "User",
  startAt: 1
});

/**
 * Password hashing
 */
UserSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password"))
    return next();

  user.salt = crypto.randomBytes(128).toString('base64');
  user.password = crypto.pbkdf2Sync(user.password, user.salt, 10000, 512, 'sha512');
  next();
});

/**
 * Password compare
 */
UserSchema.methods.comparePassword = function (password) {
  return this.password == crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512');
};

let user = mongoose.model("User", UserSchema);

module.exports = user;
