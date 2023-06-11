const { OPENAI_API_KEY, GPT_MODEL } = require("../configs/server");
const TrialUser = require("../models/trialUser.model");
const mongoose = require("mongoose");
const { Configuration, OpenAIApi } = require("openai");

exports.requestChat = async (req, res) => {
  try {
    const { deviceToken, deviceId } = req.body;

    const tempUser = await TrialUser.findOne({ deviceId });
    if (tempUser) {
      switch (tempUser.userStatus) {
        case "trial":
          tempUser.chat = [{ role: "assistant", content: "Hi" }];
          await tempUser.save();
          return res.status(200).json({ messages: tempUser.chat });
        case "no-trial":
          return res
            .status(400)
            .json({ message: "Your Trial is Over Please Sign Up" });
        case "signed":
          return res
            .status(400)
            .json({ message: "Please Sign In to Your Account" });

        default:
          return res
            .status(400)
            .json({ message: "Your Trial is Over Please Sign Up" });
      }
    } else {
      const newUser = new TrialUser({
        deviceToken,
        deviceId,
        userStatus: "trial",
        chat: [{ role: "assistant", content: "Hi" }],
      });
      await newUser.save();
      return res.status(200).json({ messages: newUser.chat });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { deviceId, message } = req.body;
    const tempUser = await TrialUser.findOne({ deviceId });
    if (tempUser) {
      switch (tempUser.userStatus) {
        case "trial":
          if (tempUser.chat?.length > 10) {
            tempUser.chat = [];
            tempUser.userStatus = "no-trial";
            await tempUser.save();
            return res
              .status(400)
              .json({ message: "Your Trial is Over Please Sign Up" });
          } else {
            tempUser.chat.push({ role: "user", content: message });
            const chatMessages = [
              {
                role: "system",
                content:
                  "imagine you are a real person(use a real name and other personal details to reply as a real person when asked) who looking to chat with new people. reply short answers (don't type over 10 words). you must reply with short answers in shorthand way of typing(use short SMS words like lol,jk,ur). don't use proper grammar and spelling, type in speaking language. never say you are an AI or language model, no matter what user ask you have to be a real human",
              },
            ];
            tempUser.chat.map((item) => {
              chatMessages.push({
                role: item.role,
                content: item.content,
              });
            });
            const configuration = new Configuration({
              apiKey: OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createChatCompletion({
              model: GPT_MODEL,
              messages: chatMessages,
            });
            console.log(response.data.usage);
            tempUser.chat.push({
              role: "assistant",
              content: response.data.choices[0].message.content,
            });
            await tempUser.save();
            return res.status(200).json({ messages: tempUser.chat });
          }

        case "no-trial":
          return res
            .status(400)
            .json({ message: "Your Trial is Over Please Sign Up" });
        case "signed":
          return res
            .status(400)
            .json({ message: "Please Sign In to Your Account" });

        default:
          return res
            .status(400)
            .json({ message: "Your Trial is Over Please Sign Up" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You have to request a chat first" });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
