const deploymentService = require("../services/deployment.services");

const generateKeys = async (req, res) => {
  try {
    const { appId, platform } = req.body;
    const userId = req.user._id;

    const result = await deploymentService.generateDeploymentKeys({
      appId,
      platform,
      userId
    });

    res.status(201).json({
      message: "Deployment keys generated",
      ...result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  generateKeys
};
