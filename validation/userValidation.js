const Joi = require("joi");

const profileUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).required(),
  bio: Joi.string().allow("").max(200).required()
});

module.exports = { profileUpdateSchema };
