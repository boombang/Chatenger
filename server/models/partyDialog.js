"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let partyDialogSchema = new Schema({
  id: Schema.Types.ObjectId,
  creatorId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  members: [{
    id: Number,
    login: String
  }]
}, {
  versionKey: false,
  usePushEach: true
});

let partyDialog = mongoose.model("PartyDialog", partyDialogSchema);

module.exports = partyDialog;
