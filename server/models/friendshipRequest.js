"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipRequestSchema = new Schema({
  userRequestTo: {
    id: {
      type: Number,
      required: true
    },
    login: {
      type: String,
      required: true
    }
  },
  userRequestFrom: {
    id: {
      type: Number,
      required: true
    },
    login: {
      type: String,
      required: true
    }
  }
}, {
  versionKey: false
});

let friendshipRequest = mongoose.model("FriendshipRequest", friendshipRequestSchema);

module.exports = friendshipRequest;
