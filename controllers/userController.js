const User = require("../models/User");
const { profileUpdateSchema } = require("../validation/userValidation");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("username email bio createdAt");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { error, value } = profileUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(" ") });

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username: value.username, bio: value.bio },
      { new: true, runValidators: true }
    ).select("username email bio createdAt");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
