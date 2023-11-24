const Agent = require("../models/agentModel");

// create agent
const createAgent = async (req, res) => {
  const { username } = req.body;
  try {
    const existingAgent = await Agent.findOne({ username });

    if (existingAgent) {
      res.status(200).json(existingAgent);
    } else {
      const agent = await Agent.create({
        username,
      });
      res.status(201).json(agent);
    }
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
  getOnlineAgents,
  updateAvailability,
};
