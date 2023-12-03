const express = require("express");
const {
  updateChatOption,
  getChatOption,
} = require("../controllers/organizationController");

const router = express.Router();
//Create a new user
router.patch("/chat-option", updateChatOption);

//get a user
router.get("/chat-option", getChatOption);

module.exports = router;
