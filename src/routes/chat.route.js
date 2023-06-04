const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

router.post("/request-chat", chatController.requestChat);
router.post("/send-message", chatController.sendMessage);

module.exports = router;
