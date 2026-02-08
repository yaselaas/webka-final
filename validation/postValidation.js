const Joi = require("joi");

const postCreateSchema = Joi.object({
  title: Joi.string().trim().min(2).max(80).required(),
  content: Joi.string().trim().min(2).max(2000).required()
});

const postUpdateSchema = Joi.object({
  title: Joi.string().trim().min(2).max(80).required(),
  content: Joi.string().trim().min(2).max(2000).required()
});

module.exports = { postCreateSchema, postUpdateSchema };
