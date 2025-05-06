const Bundle = require("../models/bundle.model");
const Deployment = require("../models/deployment.model");
const bundleService = require("../services/bundle.services");

const uploadBundle = async (req, res) => {
  try {
    const { orgId, deploymentKey, version, platform, identifier } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided for upload." });
    }
    const result = await bundleService.uploadBundle({
      orgId,
      deploymentKey,
      version,
      file,
      platform,
      identifier,
      res
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkForUpdates = async (req, res) => {
  try {
    const { orgId, deploymentKey, currentVersion } = req.params;
    const updateInfo = await bundleService.checkForUpdates(
      orgId,
      deploymentKey,
      currentVersion
    );

    res.status(200).json(updateInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const downloadBundle = async (req, res) => {
  try {
    const { orgId, deploymentKey, version } = req.params;
    const filePath = await bundleService.getLatestBundle(
      orgId,
      deploymentKey,
      version
    );
    res.download(filePath);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const rollbackBundle = async (req, res) => {
  const { deploymentKey, rollbackToVersion } = req.body;
  if (!deploymentKey || !rollbackToVersion) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const deployment = await Deployment.findOne({ deploymentKey });
    if (!deployment)
      return res.status(404).json({ error: "Invalid deployment key" });
    const currentBundle = await Bundle.findOne({
      deployment: deployment._id,
      isActive: true
    });
    const rollbackBundle = await Bundle.findOne({
      deployment: deployment._id,
      version: rollbackToVersion
    });

    if (!rollbackBundle)
      return res.status(404).json({ error: "Rollback version not found" });

    if (
      currentBundle &&
      currentBundle._id.toString() !== rollbackBundle._id.toString()
    ) {
      currentBundle.isActive = false;
      await currentBundle.save();
    }

    rollbackBundle.isActive = true;
    rollbackBundle.rollbackFrom = currentBundle?._id || null;
    await rollbackBundle.save();

    const redisKey = `bundle:${deploymentKey}`;
    await redisClient.set(redisKey, JSON.stringify(rollbackBundle));

    return res.status(200).json({
      message: `Rolled back to version ${rollbackToVersion}`,
      bundle: rollbackBundle
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rollback failed" });
  }
};

module.exports = {
  uploadBundle,
  checkForUpdates,
  downloadBundle,
  rollbackBundle
};
