const express = require("express");
const reportController = require("../../controller/report.controller");

const router = express.Router();

router.post("/report", reportController.reportClientVersion);

module.exports = router;
