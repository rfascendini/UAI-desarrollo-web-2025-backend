import Joi from "joi";

const username = Joi.string().trim().min(3).max(24).pattern(/^[a-zA-Z0-9_.-]+$/).required();

export const registerUserValidationScheme = Joi.object({
  firstName: Joi.string().trim().min(2).max(40).required(),
  lastName: Joi.string().trim().min(2).max(40).required(),
  username,
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(72).required(),
});

export const updateProfileValidationScheme = Joi.object({
  firstName: Joi.string().trim().min(2).max(40).required(),
  lastName: Joi.string().trim().min(2).max(40).required(),
  username,
});

export default registerUserValidationScheme;
