"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let partyDialogMemberSchema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  partyDialogId: {
    type: Schema.Types.ObjectId,
    ref: 'PartyDialog'
  },
}, {
  versionKey: false
});

let partyDialogMember = mongoose.model("PartyDialogMember", partyDialogMemberSchema);

module.exports = partyDialogMember;
