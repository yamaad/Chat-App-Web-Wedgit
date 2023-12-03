const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  chat_option: {
    type: String,
    enum: ["systemChatbot", "organizationChatbot", "liveAgent"],
    default: "systemChatbot",
  },
  chatbot_URL: {
    type: String,
    require: function () {
      return this.chat_option === "organizationChatbot";
    },
  },
  chatbot_token: {
    type: String,
    require: function () {
      return this.chat_option === "organizationChatbot";
    },
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
