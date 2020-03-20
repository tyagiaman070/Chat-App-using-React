const express = require("express");
const router = express.Router();

// const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");
// const { users } = require("./index");

router.get("/", (req, res) => {
  res.send("Sever is running");
});

module.exports = router;
