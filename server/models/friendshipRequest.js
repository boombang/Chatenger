"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipRequestSchema = new Schema({
  userIdRequestTo: {
    type: Number,
    required: true
  },
  userIdRequestFrom: {
    type: Number,
    required: true
  }
}, {
  versionKey: false
});

let friendshipRequest = mongoose.model("FriendshipRequest", friendshipRequestSchema);

module.exports = friendshipRequest;
