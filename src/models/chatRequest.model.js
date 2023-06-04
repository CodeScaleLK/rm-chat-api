const mongoose = require("mongoose");

const ChatRequestSchema = new mongoose.Schema({
  signed: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trial: { type: mongoose.Schema.Types.ObjectId, ref: "TrialUser" },
});

const ChatRequest = mongoose.model("ChatRequest", ChatRequestSchema);

module.exports = ChatRequest;
