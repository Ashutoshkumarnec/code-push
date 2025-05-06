const userService = require("../services/user.service");

const inviteToApp = async (req, res) => {
  try {
    const { email, appId, role } = req.body;
    const inviterId = req.user._id;

    const result = await userService.inviteToApp({
      email,
      appId,
      role,
      inviterId
    });
    res.status(200).json({ message: "App-level invite sent", invite: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  inviteToApp
};
