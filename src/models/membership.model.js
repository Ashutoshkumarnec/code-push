const mongoose = require("mongoose");
const { models } = require("../config/models");

const MembershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.USER,
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.ORGANIZATION,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "developer", "viewer"],
    default: "developer"
  },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: models.USER },
  status: { type: String, enum: ["active", "invited"], default: "invited" },
  createdAt: { type: Date, default: Date.now }
});

MembershipSchema.index({ user: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model(models.MEMBERSHIP, MembershipSchema);
