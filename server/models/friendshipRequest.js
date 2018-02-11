"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipRequestSchema = new Schema({
  userRequestTo: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  userRequestFrom: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

let friendshipRequest = mongoose.model("FriendshipRequest", friendshipRequestSchema);

module.exports = friendshipRequest;
