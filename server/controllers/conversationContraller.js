const Agent = require("../models/agentModel");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//Start a new conversation
const startConversation = async (req, res) => {
  const { user_id } = req.body;
  try {
    // Find online agents
    const agents = await Agent.find({
      is_online: true,
    });

    const userExists = await User.exists({ _id: user_id });
    if (!userExists || !agents || agents.length === 0) {
      return res
        .status(404)
        .json({ error: "no agent available or user not found" });
    }
    //Count active conversations for each agent
    const activeConversationsCounts = await Promise.all(
      agents.map(async (agent) => {
        const count = await Conversation.countDocuments({
          agent_id: agent._id,
          is_active: true,
        });
        return { agentId: agent._id, count };
      })
    );
    // Find the agent with the least active conversations
    activeConversationsCounts.sort((a, b) => a.count - b.count);
    const selectedAgent = activeConversationsCounts[0];

    const conversation = await Conversation.create({
      agent_id: selectedAgent.agentId,
      user_id,
      start_time: new Date(),
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// End conversation
const endConversation = async (req, res) => {
  const { conversationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  try {
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      end_time: new Date(),
      is_active: false,
    });
    if (!conversation) {
      return res.status(400).json({ error: "no conversation found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get conversations assigned to agent
const getAgentConversations = async (req, res) => {
  const { agentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  try {
    const conversations = await Conversation.find({ agent_id: agentId }).sort({
      end_time: 1,
      start_time: 1,
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { startConversation, endConversation, getAgentConversations };
