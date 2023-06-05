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

module.exports = startChat;
