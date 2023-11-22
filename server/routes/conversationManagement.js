const express = require("express");
const {
  startConversation,
  endConversation,
} = require("../controllers/conversationContraller");

const router = express.Router();

//Start a new conversation
router.post("/", startConversation);

//End Conversation
router.patch("/:conversationId", endConversation);

module.exports = router;
