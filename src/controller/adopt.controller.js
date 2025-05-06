const Install = require("../models/clientIntall.model");
const Bundle = require("../models/bundle.model");

const getAdoptionRate = async (req, res) => {
  const { appId, platform, channel } = req.query;

  try {
    const activeBundle = await Bundle.findOne({
      app: appId,
      platform,
      channel,
      isActive: true
    });
    if (!activeBundle)
      return res.status(404).json({ error: "No active bundle" });

    const totalUsers = await Install.countDocuments({
      app: appId,
      platform,
      channel
    });
    const adoptedUsers = await Install.countDocuments({
      app: appId,
      platform,
      channel,
      currentVersion: activeBundle.version
    });

    const adoptionRate =
      totalUsers === 0 ? 0 : (adoptedUsers / totalUsers) * 100;

    res.json({
      version: activeBundle.version,
      totalUsers,
      adoptedUsers,
      adoptionRate: Math.round(adoptionRate * 100) / 100
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch adoption rate" });
  }
};

module.exports = {
  getAdoptionRate
};
