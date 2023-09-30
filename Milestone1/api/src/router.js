const express = require("express");
const router = express.Router();

// Test route
router.get("/", (req, res) => res.send({"your api": "it works!"}));

module.exports = router;