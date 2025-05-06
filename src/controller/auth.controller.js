const authService = require("../services/auth.services");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Logged in", user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = {
  loginUser
};
