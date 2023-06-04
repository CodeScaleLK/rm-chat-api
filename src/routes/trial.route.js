const express = require("express");
const router = express.Router();
const trialController = require("../controllers/trial.controller");

router.post("/request-chat", trialController.requestChat);
router.post("/send-message", trialController.sendMessage);

module.exports = router;
