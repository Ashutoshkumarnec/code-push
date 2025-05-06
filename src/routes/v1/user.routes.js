const express = require("express");
const router = express.Router();
const userController = require("../../controller/user.controller");
const { auth } = require('../../middlewares/auth')

router.post("/register", userController.registerUser);
router.post("/invite", auth, userController.sendInvite);

module.exports = router;
