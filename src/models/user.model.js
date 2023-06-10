const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  deviceToken: {
    type: String,
    required: false,
  },
  jwtUpdated: {
    type: Date,
    required: false,
  },
  previousChats: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  currentChat: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
