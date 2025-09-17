import Joi from "joi";

const createUserValidationScheme = Joi.object({
  firstName: Joi.string().min(3).max(15).required().messages({
    "string.base": `"firstName" should be a type of 'text'`,
    "string.min": `"firstName" should have a minimum length of 3`,
    "string.max": `"firstName" should have a maximum length of 15`,
    "any.required": `"firstName" is a required field`
  }),
  lastName: Joi.string().min(3).max(15).required().messages({
    "string.base": `"lastName" should be a type of 'text'`,
    "string.min": `"lastName" should have a minimum length of 3`,
    "string.max": `"lastName" should have a maximum length of 15`,
    "any.required": `"lastName" is a required field`
  }),
  email: Joi.string().required().email({ tlds: { allow: false } }).messages({
    "string.base": `"email" should be a type of 'text'`,
    "any.required": `"email" is a required field`
  }),
  password: Joi.string().min(3).max(15).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.min": `"password" should have a minimum length of 3`,
    "string.max": `"password" should have a maximum length of 15`,
    "any.required": `"password" is a required field`
  }),
  isActive: Joi.number().valid(0, 1).optional().messages({
    "number.base": `"isActive" should be a type of 'number'`,
    "any.only": `"isActive" must be 0 or 1`
  })
});

export default createUserValidationScheme;
