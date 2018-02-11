"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let partyDialogSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  members: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }]
});

let partyDialog = mongoose.model("PartyDialog", partyDialogSchema);

module.exports = partyDialog;
