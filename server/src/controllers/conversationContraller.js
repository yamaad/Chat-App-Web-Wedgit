const Agent = require("../models/agentModel");
const Conversation = require("../models/conversationModel");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// get chat option
const getChatOption = async () => {
  try {
    const chatOption = await Organization.findOne();
    if (chatOption) return chatOption.chat_option;
    const defaultChatOption = await Organization.create({
      default: true,
    });
    if (defaultChatOption) return defaultChatOption.chat_option;
    if (!chatOption && !defaultChatOption)
      throw new ERROR("unable to get chat options");
  } catch (error) {
    console.error("unable to get chat options, ERROR:", error);
    throw error;
  }
};
//select agent
const selectAgent = async () => {
  try {
    // Find online agents
    const agents = await Agent.find({
      is_online: true,
    });
    if (!agents || agents.length === 0) {
      return false;
    } else {
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
      return selectedAgent;
    }
  } catch (error) {
    console.error("unable to select agent ERROR:", error);
    throw error;
  }
};

//Start a new conversation
const startConversation = async (req, res) => {
  const { user_id } = req.body;
  try {
    //check is user exists
    const userExists = await User.exists({ _id: user_id });
    if (!userExists) {
      return res.status(404).json({ error: "user not found" });
    }
    const chatOption = await getChatOption();
    const selectedAgent = await selectAgent();
    if (chatOption === "liveAgent" && selectedAgent) {
      const conversation = await Conversation.create({
        user_id,
        is_chatbot_assigned: false,
        agent_id: selectedAgent.agentId,
        start_time: new Date(),
        last_message_at: new Date(),
      });
      res.status(200).json(conversation);
    } else if (chatOption === "organizationChatbot") {
      const conversation = await Conversation.create({
        user_id,
        start_time: new Date(),
        is_chatbot_assigned: true,
        chatbot_model: chatOption,
        last_message_at: new Date(),
      });
      res.status(200).json(conversation);
    } else {
      const conversation = await Conversation.create({
        user_id,
        start_time: new Date(),
        is_chatbot_assigned: true,
        chatbot_type: "systemChatbot",
        last_message_at: new Date(),
      });
      res.status(200).json(conversation);
    }
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
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        end_time: new Date(),
        is_active: false,
      },
      { new: true }
    );
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
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return res.status(404).json({ error: "No valid id" });
  }
  try {
    const conversations = await Conversation.aggregate([
      { $match: { agent_id: new mongoose.Types.ObjectId(agentId) } },
      { $sort: { last_message_at: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  startConversation,
  endConversation,
  getAgentConversations,
  getChatOption,
};
