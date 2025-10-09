const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).min(1); // At least one field must be provided

module.exports = updateUserSchema;
