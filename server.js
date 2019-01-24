// static server
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

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

// passport middleware
app.use(passport.initialize());
// passport config
require("./config/passport")(passport);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server running on port ${port}`));
