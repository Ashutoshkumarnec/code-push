const Membership = require("../models/membership.model");

const requireRole = (requiredRoles = []) => {
  return async (req, res, next) => {
    const userId = req.user._id;
    const orgId = req.params.orgId || req.body.orgId;

    const membership = await Membership.findOne({
      user: userId,
      organization: orgId
    });

    if (!membership || !requiredRoles.includes(membership.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.membership = membership;
    next();
  };
};

module.exports = {
  requireRole
};
