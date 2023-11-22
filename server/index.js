const express = require("express");
require("dotenv").config();

const app = express();

//  middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


//routes

// listener
app.listen(process.env.PORT, () => {
  console.log("listening on port to server");
});
