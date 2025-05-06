const mongoose = require("mongoose");
const { models } = require('../config/models')

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  platforms: {
    type: String,
    enum: ["ios", "android", "web"],
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.USER,
    required: true
  },
  current_version: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
});

/**
 * @typedef APP
 */
const APP = mongoose.model(models.APP, appSchema);

module.exports = APP;
