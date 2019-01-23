var express = require("express");
var router = express.Router();
var gravatar = require("gravatar");
var bcrypt = require("bcryptjs");

// load user model
const User = require("../models/User");

router.get("/test", (req, res) => res.send(" user it is working"));

// register router
router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already Exists" });
    } else {
      // avatar from gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      // intit newuser
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // hash password by using bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
          if (err) throw err;
          newUser.password = hashedPassword;
          newUser
            .save()
            .then(user => res.send(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
