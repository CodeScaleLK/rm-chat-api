const ChatRequest = require("../models/chatRequest.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.requestChat = async (req, res) => {
  try {
    const { uid } = res.locals.user;
    const user = await User({ userId: uid });
    const newChat = await ChatRequest.findOne({});
    if (newChat) {
      const chattingUser = newChat.signed;
      await ChatRequest.findOneAndUpdate({}, { signed: null });
      // start chat with chattingUser
      // we have to send fcm notification to stop loading and start chat

      return res.status(200).json({ message: "Chat started" });
    } else {
      await ChatRequest.findOneAndUpdate({}, { signed: user._id });
      return res.status(200).json({
        message: "Please Wait for a Random Chat",
      });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    //stop chat
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
