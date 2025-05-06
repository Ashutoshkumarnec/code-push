const mongoose = require("mongoose");
const { models } = require("../config/models");

const ClientInstallSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  app: { type: mongoose.Schema.Types.ObjectId, ref: models.APP, required: true },
  platform: { type: String, enum: ["android", "ios", "web"], required: true },
  channel: { type: String, default: "production" },
  currentVersion: { type: String, required: true },
  lastSeen: { type: Date, default: Date.now }
});

ClientInstallSchema.index(
  { deviceId: 1, app: 1, platform: 1, channel: 1 },
  { unique: true }
);

module.exports = mongoose.model(models.CLIENTINSTALL, ClientInstallSchema);
