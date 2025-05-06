const mongoose = require("mongoose");
const { models } = require("../config/models");

const AppMembershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.USER,
    required: true
  },
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: models.APP,
    required: true
  },
  role: {
    type: String,
    enum: ["app_admin", "app_developer", "app_viewer"],
    default: "app_developer"
  },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: models.USER },
  status: { type: String, enum: ["active", "invited"] },
  createdAt: { type: Date, default: Date.now }
});

AppMembershipSchema.index({ user: 1, app: 1 }, { unique: true });

module.exports = mongoose.model(models.APPMEMBERSHIP, AppMembershipSchema);
