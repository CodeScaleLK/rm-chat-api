const ChatRequest = require("../models/chatRequest.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.requestChat = async (req, res) => {
  try {
    const { uid } = res.locals.user;
    const user = await User({ userId: uid });
    const newChat = await ChatRequest.findOne({ requestType: "random-chat" });
    if (newChat.currentUser) {
      const chattingUser = newChat.currentUser;
      await ChatRequest.findOneAndUpdate(
        { requestType: "random-chat" },
        { currentUser: null }
      );
      // start chat with chattingUser
      // we have to send fcm notification to stop loading and start chat

      return res
        .status(200)
        .json({ message: `Chat started with ${chattingUser}` });
    } else {
      await ChatRequest.findOneAndUpdate(
        { requestType: "random-chat" },
        { currentUser: user._id }
      );
      return res.status(200).json({
        message: "Please Wait for a Random User",
      });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    //sed messages with fcm
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
