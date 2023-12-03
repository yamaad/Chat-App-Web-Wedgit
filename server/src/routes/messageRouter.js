const express = require("express");
const {
  sendMessage,
  getChatHistory,
} = require("../controllers/messageController");

const router = express.Router();

//Send a message in a conversation
router.post("/", (req, res) => sendMessage(req, res, req.app.get("io")));

//Get the message history
router.get("/:conversationId", getChatHistory);

module.exports = router;
