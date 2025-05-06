const mongoose = require("mongoose");
const { models } = require("../config/models");

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ownerEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(models.ORGANIZATION, OrganizationSchema);
