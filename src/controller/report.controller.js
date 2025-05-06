const Install = require("../models/clientIntall.model");
const App = require("../models/app.model");

const reportClientVersion = async (req, res) => {
  const { deviceId, appName, platform, channel, currentVersion } = req.body;

  try {
    const app = await App.findOne({ name: appName });
    if (!app) return res.status(404).json({ error: "App not found" });

    await Install.findOneAndUpdate(
      { deviceId, app: app._id, platform, channel },
      { currentVersion, lastSeen: new Date() },
      { upsert: true }
    );

    res.status(200).json({ message: "Reported" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to report" });
  }
};

module.exports = {
  reportClientVersion
};
