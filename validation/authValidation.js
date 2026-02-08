const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).required()
    .messages({ "string.pattern.base": "Username can contain letters, numbers, and underscore only." }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required()
    .messages({ "string.pattern.base": "Password must include uppercase, lowercase, and a number." }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required()
    .messages({ "any.only": "Passwords do not match." })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});

module.exports = { registerSchema, loginSchema };
