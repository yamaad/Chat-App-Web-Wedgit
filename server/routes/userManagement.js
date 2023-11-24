const express = require("express");
const { createUser, getUser } = require("../controllers/userContraller");

const router = express.Router();
//Create a new user
router.post("/", createUser);

//get a user
router.get("/:userId", getUser);


module.exports = router;