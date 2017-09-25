"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let blackListSchema = new Schema({
  blackedUserId: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
}, {
  versionKey: false
});

let blackList = mongoose.model("BlackList", blackListSchema);

module.exports = blackList;
