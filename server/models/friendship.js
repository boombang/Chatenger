"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipSchema = new Schema({
  firstFriend: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  secondFriend: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

let friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = friendship;
