var express = require("express");

var router = express.Router();

router.get("/test", (req, res) => res.json("profile it is working ..."));

module.exports = router;
