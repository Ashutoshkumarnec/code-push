const express = require("express");
const adoptController = require("../../controller/adopt.controller");

const router = express.Router();

router.post("/adoption", adoptController.getAdoptionRate);

module.exports = router;
