const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agentSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  is_online: {
    type: Boolean,
    default: true,
  },
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
