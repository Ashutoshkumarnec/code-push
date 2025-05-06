const mongoose = require("mongoose");
const { models } = require("../config/models");

const BundleSchema = new mongoose.Schema({
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.APP,
    required: true
  },
  version: { type: String, required: true },
  platform: {
    type: String,
    enum: ["android", "ios", "web", "desktop"],
    required: true
  },
  channel: {
    type: String,
    default: "production",
    enum: ["production", "staging"]
  },
  filePath: { type: String, required: true },
  hash: { type: String },
  mandatory: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
  rollbackFrom: { type: mongoose.Schema.Types.ObjectId, ref: models.BUNDLE },
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.DEPLOYMENT,
    required: true
  }
});

BundleSchema.index({ app: 1, platform: 1, channel: 1, version: -1 });

/**
 * @typedef Bundle
 */

const Bundle = mongoose.model(models.BUNDLE, BundleSchema);

module.exports = Bundle;
