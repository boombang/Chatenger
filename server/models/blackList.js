"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let blackListSchema = new Schema({
  blackedUser: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

let blackList = mongoose.model("BlackList", blackListSchema);

module.exports = blackList;
