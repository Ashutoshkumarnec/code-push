const express = require("express");
const router = express.Router();
const deploymentController = require("../../controller/deployment.controller");
const { auth } = require('../../middlewares/auth')

router.post("/generate", auth, deploymentController.generateKeys);

module.exports = router;
