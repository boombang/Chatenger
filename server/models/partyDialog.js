"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let partyDialogSchema = new Schema({
  id: Schema.Types.ObjectId,
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
}, {
  versionKey: false
});

let partyDialog = mongoose.model("PartyDialog", partyDialogSchema);

module.exports = partyDialog;
