const Organization = require("../models/organisation.model");
const Membership = require("../models/membership.model");
const App = require("../models/app.model");

const createOrganization = async ({ name, ownerId, ownerEmail = '' }) => {
  const existing = await Organization.findOne({ name });
  if (existing) throw new Error("Organization name already taken");

  const org = await Organization.create({
    name,
    ownerEmail,
    createdAt: new Date()
  });

  await Membership.create({
    user: ownerId,
    organization: org._id,
    role: "admin",
    status: "active"
  });

  return { organization: org };
};

const createApp = async ({ orgId, name, platforms, userId, identifier }) => {
  const membership = await Membership.findOne({
    user: userId,
    organization: orgId
  });
  if (!membership || membership.role !== "admin") {
    throw new Error(
      "You are not authorized to create apps in this organization"
    );
  }

  const existingApp = await App.findOne({ name, organization: orgId });
  if (existingApp)
    throw new Error("App with this name already exists in the organization");

  const app = await App.create({
    name,
    organization: orgId,
    platforms,
    createdAt: new Date(),
    identifier,
    created_by: userId
  });

  return app;
};

module.exports = {
  createOrganization,
  createApp
};
