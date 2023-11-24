const Agent = require("../models/agentModel");
const AssignedConversation = require("../models/assignedConversationModel");
const Conversation = require("../models/conversationModel");
const mongoose = require("mongoose");

// create agent
const createAgent = async (req, res) => {
  const { username } = req.body;
  try {
    const agent = await Agent.create({
      username,
    });
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get all online agents
const getOnlineAgents = async (req, res) => {
  const agents = await Agent.find({
    is_online: true,
  });
  res.status(200).json(agents);
};

//TODO Assign conversation to online agent
const assignConversation = async (req, res) => {
  //TODO assigning algorithm : round-robin, agent ordered by the least assigned active conversation
  const { agent_id, conversation_id } = req.body;
  try {
    const assignedConversation = await AssignedConversation.create({
      agent_id,
      conversation_id,
    });
    res.status(200).json(assignedConversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get conversations assigned to agent
const getAgentConversations = async (req, res) => {
  const { agentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  try {
    const assignedConversations = await AssignedConversation.find({
      agent_id: agentId,
    });
    const conversationPromises = assignedConversations.map(
      async (assignedConversation) => {
        const conversation = await Conversation.findById(
          assignedConversation.conversation_id
        ).sort({
          end_time: 1,
          start_time: 1,
        });
        return conversation;
      }
    );
    const conversations = await Promise.all(conversationPromises);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update agents availability
const updateAvailability = async (req, res) => {
  const { id, is_online } = req.body;
  const agent = await Agent.findByIdAndUpdate(id, {
    is_online,
  });
  if (!agent) {
    return res.status(400).json({ error: "no conversation found" });
  }
  res.status(200).json(agent);
};

module.exports = {
  createAgent,
  assignConversation,
  getOnlineAgents,
  getAgentConversations,
  updateAvailability,
};
