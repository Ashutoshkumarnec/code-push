const orgService = require("../services/org.service");

const createOrganization = async (req, res) => {
  try {
    const result = await orgService.createOrganization({
      name: req.body.name,
      ownerId: req.user._id,
      ownerEmail: req.body.ownerEmail
    });
    res.status(201).json({ message: "Organization created", ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createApp = async (req, res) => {
  try {
    const { orgId } = req.params;
    const result = await orgService.createApp({
      orgId,
      name: req.body.name,
      platforms: req.body.platforms,
      userId: req.user._id,
      identifier: req.body.identifier
    });
    res.status(201).json({ message: "App created", app: result });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  createOrganization,
  createApp
};
