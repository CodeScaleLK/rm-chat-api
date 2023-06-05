const ChatRequest = require("../models/chatRequest.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { startChat, sendMessage } = require("../services/chat.service");

exports.requestChat = async (req, res) => {
  try {
    const { uid } = res.locals.user;
    const user = await User.findOne({ userId: uid });
    const newChat = await ChatRequest.findOne({ requestType: "random-chat" });
    const isCurrentUserInPreviousChats = user.previousChats.includes(
      newChat.currentUser
    );
    if (
      newChat.currentUser &&
      newChat.currentUser.toString() != user._id.toString() &&
      !isCurrentUserInPreviousChats
    ) {
      const chattingUser = await User.findById(newChat.currentUser);
      await ChatRequest.findOneAndUpdate(
        { requestType: "random-chat" },
        { currentUser: null }
      );
      user.previousChats.push(chattingUser._id);
      user.currentChat = chattingUser._id;
      await user.save();
      chattingUser.previousChats.push(user._id);
      chattingUser.currentChat = user._id;
      await chattingUser.save();
      startChat(user);
      startChat(chattingUser);
      return res
        .status(200)
        .json({ message: `Chat started with ${chattingUser.email}` });
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
    const { uid } = res.locals.user;
    const sender = await User.findOne({ userId: uid });
    const receiver = await User.findById(sender.currentChat);
    const { message } = req.body.message;
    sendMessage(sender, receiver, message);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
