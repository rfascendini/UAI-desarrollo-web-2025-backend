import Joi from "joi";

const username = Joi.string()
  .trim()
  .min(3)
  .max(24)
  .pattern(/^[a-zA-Z0-9_.-]+$/)
  .required()
  .messages({
    "string.empty": "El usuario es obligatorio.",
    "string.min": "El usuario debe tener al menos 3 caracteres.",
    "string.max": "El usuario no puede superar los 24 caracteres.",
    "string.pattern.base": "El usuario solo puede usar letras, números, guiones, puntos y guion bajo.",
    "any.required": "El usuario es obligatorio.",
  });

export const registerUserValidationScheme = Joi.object({
  firstName: Joi.string().trim().min(2).max(40).required().messages({
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "string.max": "El nombre no puede superar los 40 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  lastName: Joi.string().trim().min(2).max(40).required().messages({
    "string.empty": "El apellido es obligatorio.",
    "string.min": "El apellido debe tener al menos 2 caracteres.",
    "string.max": "El apellido no puede superar los 40 caracteres.",
    "any.required": "El apellido es obligatorio.",
  }),
  username,
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "El correo electrónico es obligatorio.",
    "string.email": "Ingresá una dirección de correo válida.",
    "any.required": "El correo electrónico es obligatorio.",
  }),
  password: Joi.string().min(8).max(72).required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
    "string.max": "La contraseña no puede superar los 72 caracteres.",
    "any.required": "La contraseña es obligatoria.",
  }),
});

export const updateProfileValidationScheme = Joi.object({
  firstName: Joi.string().trim().min(2).max(40).required().messages({
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "string.max": "El nombre no puede superar los 40 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  lastName: Joi.string().trim().min(2).max(40).required().messages({
    "string.empty": "El apellido es obligatorio.",
    "string.min": "El apellido debe tener al menos 2 caracteres.",
    "string.max": "El apellido no puede superar los 40 caracteres.",
    "any.required": "El apellido es obligatorio.",
  }),
  username,
});

export default registerUserValidationScheme;
