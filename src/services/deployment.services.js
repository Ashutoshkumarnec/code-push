const Deployment = require("../models/deployment.model");
const AppMembership = require("../models/AppMembership.model");
const { randomUUID } = require("crypto");

exports.generateDeploymentKeys = async ({ appId, platform, userId }) => {
  const membership = await AppMembership.findOne({ user: userId, app: appId });
  if (!membership || !["admin"].includes(membership.role)) {
    throw new Error("You are not authorized to generate deployment keys");
  }
  const deployments = {};
  for (const channel of ["staging", "production"]) {
    const existing = await Deployment.findOne({
      app: appId,
      platform,
      channel
    });

    if (!existing) {
      const deploymentKey = randomUUID();

      const deployment = await Deployment.create({
        app: appId,
        platform,
        channel,
        deploymentKey
      });

      deployments[channel] = deployment;
    } else {
      deployments[channel] = existing;
    }
  }

  return deployments;
};
