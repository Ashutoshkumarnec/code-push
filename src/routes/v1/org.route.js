const express = require("express");
const router = express.Router();
const orgController = require("../../controller/org.controller");
const { auth } = require('../../middlewares/auth')

router.post("/create", auth, orgController.createOrganization);
router.post("/:orgId/apps", auth, orgController.createApp);

module.exports = router;
