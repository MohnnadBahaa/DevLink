const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user 
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
});

module.exports = User = mongoose.model("user", UserSchema);
