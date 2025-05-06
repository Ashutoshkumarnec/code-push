const userService = require("../services/user.service");

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sendInvite = async (req, res) => {
  try {
    const { email, organizationId, role } = req.body;
    const inviterId = req.user._id;

    const result = await userService.sendInvite({
      email,
      organizationId,
      role,
      inviterId
    });
    res.status(200).json({ message: "Invitation sent", invite: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  sendInvite
};
