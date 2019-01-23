var express = require("express");
var router = express.Router();
var gravatar = require("gravatar");
var bcrypt = require("bcryptjs");

// load user model
const User = require("../models/User");

router.get("/test", (req, res) => res.send(" user it is working"));

// register router
// ---------- signup ---------- //
router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ signup: "Email already Exists" });
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
          if (err) {
            res.status(400).json({ signup: "invalid password" });
          }
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

// login router
// ---------- Login ---------- //
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // fin user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ login: "user not found" });
    }

    // userfound comapre password with hashed password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.status(200).json({ login: "success login" });
      } else {
        return res.status(400).json({ login: "invalid user name or password" });
      }
    });
  });
});

module.exports = router;
