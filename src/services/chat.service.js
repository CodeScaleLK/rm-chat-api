const admin = require("../configs/firebase.config");

async function startChat(user) {
  try {
    const message = {
      notification: {
        title: "Chat Started",
        body: "You have been started a new random chat",
      },
      token: user.deviceToken,
    };
    const response = await admin.messaging().send(message);
    console.log(response);
  } catch (error) {
    console.error("Error sending chat started notification:", error);
  }
}

async function sendMessage(sender, receiver, text) {
  try {
    const message = {
      data: {
        senderId: sender._id.toString(),
        sender: sender.email,
        message: text,
      },
      token: receiver.deviceToken,
    };
    const response = await admin.messaging().send(message);
    console.log(response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
module.exports = { startChat, sendMessage };
