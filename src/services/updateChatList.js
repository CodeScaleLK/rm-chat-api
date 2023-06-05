const cron = require("node-cron");
const User = require("../models/user.model");

cron.schedule("0 0 * * *", async () => {
  try {
    const users = await User.find({});
    users.forEach(async (user) => {
      user.previousChats = [];
      await user.save();
    });
    console.log("Previous chats cleared successfully");
  } catch (error) {
    console.error("Error while clearing previous chats:", error);
  }
});
