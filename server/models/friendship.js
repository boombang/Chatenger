"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let friendshipSchema = new Schema({
  firstUser: {
    id: {
      type: Number,
      required: true
    },
    login: {
      type: String,
      required: true
    }
  },
  secondUser: {
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

let friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = friendship;
