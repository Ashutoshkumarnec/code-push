const express = require("express");
const multer = require('multer');
const bundleController = require("../../controller/bundler.controller");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { auth } = require("../../middlewares/auth");

const router = express.Router();


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    resource_type: 'raw', 
  }
});

const upload = multer({ storage });

router.post(
  "/orgs/:orgId/deployments/:deploymentKey/bundles/:version/upload",
  upload.single('file'),
  bundleController.uploadBundle
);
router.get(
  "/orgs/:orgId/deployments/:deploymentKey/bundles/check-update/:currentVersion",
  bundleController.checkForUpdates
);
router.get(
  "/orgs/:orgId/deployments/:deploymentKey/bundles/:version/download",
  bundleController.downloadBundle
);
router.post("/rollback", bundleController.rollbackBundle);

module.exports = router;
