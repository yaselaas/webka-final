const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validation/authValidation");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "2h" });
}

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(" ") });

    const { username, email, password } = value;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, passwordHash });
    const token = signToken(user._id.toString());

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, bio: user.bio }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(" ") });

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid email or password." });

    const token = signToken(user._id.toString());

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, bio: user.bio }
    });
  } catch (err) {
    next(err);
  }
};
