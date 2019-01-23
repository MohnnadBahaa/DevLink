// static server
const express = require("express");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");

// Routes
var user = require("./routers/user.js");
var profile = require("./routers/profile.js");
var post = require("./routers/post.js");

// bodyParser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongodbURI;

// Connection with mongo
mongoose
  .connect(db)
  .then(() => console.log("Successfully connection with mongoDB"))
  .catch(err => console.log(err));

// use routes
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/post", post);

// running test
app.get("/", (req, res) => res.send("Hello world"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server running on port ${port}`));
