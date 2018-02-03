"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let blackListSchema = new Schema({
  blackedUser: {
    id: {
      type: Number,
      required: true
    },
    login: {
      type: String,
      required: true
    }
  },
  user: {
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

let blackList = mongoose.model("BlackList", blackListSchema);

module.exports = blackList;
