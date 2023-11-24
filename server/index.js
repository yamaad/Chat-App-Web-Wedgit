const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const userManagementRoutes = require("./routes/userManagement");
const conversationManagementRoutes = require("./routes/conversationManagement");
const agentManagementRoutes = require("./routes/agentManagement");
const messageManagementRoutes = require("./routes/messageManagement");

const app = express();

//  middleware
app.use((req, res, next) => {
  // console.log(req.path, req.method);
  console.log(`Request: ${req.method} ${req.path}`);

  // Store the original res.json and res.send methods
  const originalJson = res.json;

  // Override res.json to log the response body
  res.json = function (body) {
    console.log("Response Body:", body);
    originalJson.call(this, body);
  };

  next();
});
// middle for post requests
app.use(express.json());

//routes
app.use("/api/users", userManagementRoutes);
app.use("/api/conversations", conversationManagementRoutes);
app.use("/api/agents", agentManagementRoutes);
app.use("/api/messages", messageManagementRoutes);
//connect to DB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "chatApp" })
  .then(() => {
    // listener
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening to server");
    });
  })
  .catch((error) => {
    console.log("error: " + error);
  });

  



