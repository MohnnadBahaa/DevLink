// static server
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// DB config
const db = require("./config/keys").mongodbURI;

// Connection with mongo
mongoose
  .connect(db)
  .then(() => console.log("Successfully connection with mongoDB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello world"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server running on port ${port}`));
