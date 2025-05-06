const mongoose = require("mongoose");
const crypto = require("crypto");
const { models } = require("../config/models");

const DeploymentSchema = new mongoose.Schema({
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.APP,
    required: true
  },
  platform: { type: String, enum: ["android", "ios", "web"], required: true },
  channel: { type: String, default: "production", enum: ['production', 'staging'] },
  deploymentKey: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString("hex")
  },
  createdAt: { type: Date, default: Date.now }
});

DeploymentSchema.index({ app: 1, platform: 1, channel: 1 }, { unique: true });

module.exports = mongoose.model(models.DEPLOYMENT, DeploymentSchema);
