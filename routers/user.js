var express = require("express");
var router = express.Router();
var gravatar = require("gravatar");
var bcrypt = require("bcryptjs");
var Keys = require("../config/keys");
var jwt = require("jsonwebtoken");
var passport = require("passport");
var validateRegisterInput = require("../validation/signup");
var validateLoginInput = require("../validation/login");

// load user model
const User = require("../models/User");
router.get("/test", (req, res) => res.send(" user it is working"));
// register router
// ---------- signup ---------- //
router.post("/signup", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already Exists";
      return res.status(400).json(errors);
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
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// login router
// ---------- Login ---------- //
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // fin user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.user = "user not found";
      return res.status(404).json(errors);
    }

    // userfound comapre password with hashed password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.status(200).json({ login: "success login" });
        const payload = { id: user.id, name: user.name };

        jwt.sign(
          payload,
          Keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              res.status(400).json("terminate login");
            }
            // valid token
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ login: "invalid user name or password" });
      }
    });
  });
});

// passport
// ---------- current ---------- //
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
