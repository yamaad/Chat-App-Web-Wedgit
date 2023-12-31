const express = require("express");
const {
  startConversation,
  endConversation,
  getAgentConversations,
} = require("../controllers/conversationContraller");

const router = express.Router();

//Start a new conversation
router.post("/", (req, res) => startConversation(req, res, req.app.get("io")));

//get agent's conversations
router.get("/:agentId", getAgentConversations);
//End Conversation
router.patch("/:conversationId", endConversation);

module.exports = router;
