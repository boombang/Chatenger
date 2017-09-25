"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipSchema = new Schema({
  firstFriendId: {
    type: Number,
    required: true
  },
  secondFriendId: {
    type: Number,
    required: true
  }
}, {
  versionKey: false
});

let friendship = mongoose.model("Friendship", friendshiptSchema);

module.exports = friendship;
