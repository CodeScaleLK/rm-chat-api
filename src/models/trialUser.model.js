const mongoose = require("mongoose");

const TrialUserSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
  },
  deviceToken: {
    type: String,
    required: true,
    unique: true,
  },
  userStatus: {
    type: String,
    required: true,
    default: "trial", //this can be trial, no-trial or signed
  },
  chat: [{ role: { type: String }, content: { type: String } }],
});

const TrialUser = mongoose.model("TrialUser", TrialUserSchema);

module.exports = TrialUser;
