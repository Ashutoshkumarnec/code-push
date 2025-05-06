const mongoose = require("mongoose");
const { models } = require("../config/models");

const InvitationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.ORGANIZATION,
    required: true
  },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "developer", "viewer"],
    default: "developer"
  },
  token: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: models.USER },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  app: { type: mongoose.Schema.Types.ObjectId, ref: models.APP }
});

InvitationSchema.index({ email: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model(models.INVITATION, InvitationSchema);
