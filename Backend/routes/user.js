const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.post("/signup", wrapAsync(userController.SignUp));

router.post("/login", userController.Login);

router.post("/reset", wrapAsync(userController.reset));

router.post("/changePassword", wrapAsync(userController.changePassword));

module.exports = router;
