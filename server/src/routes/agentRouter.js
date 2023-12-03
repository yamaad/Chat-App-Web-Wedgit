const express = require("express");
const {
  getAgentConversations,
  getOnlineAgents,
  createAgent,
  assignConversation,
  updateAvailability,
} = require("../controllers/agentController");

const router = express.Router();

// create agent
router.post("/", createAgent);
//Get a list of online agents
router.get("/online", getOnlineAgents);
// update agents availability
router.patch("/online", updateAvailability);

module.exports = router;