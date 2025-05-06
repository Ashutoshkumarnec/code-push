const crypto = require("crypto");
const User = require("../models/user.model");
const Invitation = require("../models/invitation.model");
const Membership = require("../models/membership.model");
const App = require("../models/app.model");
const AppMembership = require("../models/AppMembership.model");

const registerUser = async ({ name, email, password, inviteToken }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const user = await User.create({ name, email, password });

  if (inviteToken) {
    const invite = await Invitation.findOne({
      token: inviteToken,
      status: "pending"
    });
    if (!invite) throw new Error("Invalid or expired invitation");

    await Membership.create({
      user: user._id,
      organization: invite.organization,
      role: invite.role,
      invitedBy: invite.invitedBy,
      status: "active"
    });

    invite.status = "accepted";
    await invite.save();
    if (invite.app) {
      await AppMembership.create({
        user: user._id,
        app: invite.app,
        role: invite.role,
        invitedBy: invite.invitedBy,
        status: "active"
      });
    }
  }

  return user;
};

const sendInvite = async ({ email, organizationId, role, inviterId, appId }) => {
  const existing = await Invitation.findOne({
    email,
    organization: organizationId,
    status: "pending"
  });
  if (existing) throw new Error("Invite already sent to this user");

  const token = crypto.randomBytes(24).toString("hex");

  const invite = await Invitation.create({
    email,
    organization: organizationId,
    role,
    invitedBy: inviterId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    app: appId
  });

  return invite;
};

const inviteToApp = async ({ email, appId, role, inviterId }) => {
  const app = await App.findById(appId).populate("organization");
  if (!app) throw new Error("App not found");

  const existingInvite = await Invitation.findOne({
    email,
    app: appId,
    status: "pending"
  });
  if (existingInvite) throw new Error("Invite already sent for this app");

  const token = crypto.randomBytes(24).toString("hex");

  const invite = await Invitation.create({
    email,
    app: app._id,
    organization: app.organization,
    role,
    token,
    invitedBy: inviterId,
    status: "pending",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return invite;
};

module.exports = {
  registerUser,
  sendInvite,
  inviteToApp
};
