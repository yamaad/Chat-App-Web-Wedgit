const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agentSchema = new Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => {
      return new mongoose.Types.ObjectId();
    },
    required: true,
    unique: true,
  },
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
