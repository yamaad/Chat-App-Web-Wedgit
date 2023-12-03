const Organization = require("../models/organizationModel");

// get chat options
const getChatOption = async (req, res) => {
  try {
    const chatOption = await Organization.findOne();
    if (chatOption) {
      res.status(200).json(chatOption);
    } else {
      const defaultChatOption = await Organization.create({
        default: true,
      });
      res.status(200).json(defaultChatOption);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update Chat Option
const updateChatOption = async (req, res) => {
  const { chat_option, chatbot_URL, chatbot_token } = req.body;
  console.log("updateChatOption", req.body);
  try {
    const currentChatOption = await Organization.findOne();
    if (chatbot_URL && chatbot_token) {
      //TODO: change: store token in a secure way
      const newChatOption = await Organization.findByIdAndUpdate(
        currentChatOption._id,
        { chat_option, chatbot_URL, chatbot_token },
        { runValidators: true, new: true }
      );
      res.status(200).json(newChatOption);
    } else {
      const newChatOption = await Organization.findByIdAndUpdate(
        currentChatOption._id,
        { chat_option },
        { runValidators: true, new: true }
      );
      res.status(200).json(newChatOption);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { updateChatOption, getChatOption };
