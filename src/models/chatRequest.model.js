const mongoose = require("mongoose");

const ChatRequestSchema = new mongoose.Schema({
  requestType: { type: String, required: true },
  currentUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ChatRequest = mongoose.model("ChatRequest", ChatRequestSchema);

module.exports = ChatRequest;
