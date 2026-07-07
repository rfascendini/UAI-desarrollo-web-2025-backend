import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
  "string.empty": "El identificador es obligatorio.",
  "string.hex": "El identificador no es válido.",
  "string.length": "El identificador no es válido.",
  "any.required": "El identificador es obligatorio.",
});

const serverIP = Joi.string().trim().ip({ version: ["ipv4"], cidr: "optional" }).required().messages({
  "string.empty": "La IP del servidor es obligatoria.",
  "string.ip": "Ingresá una IP de servidor válida.",
  "any.required": "La IP del servidor es obligatoria.",
});

const serverPort = Joi.number().integer().min(1).max(65535).required().messages({
  "number.base": "El puerto debe ser un número.",
  "number.integer": "El puerto debe ser un número entero.",
  "number.min": "El puerto debe ser mayor o igual a 1.",
  "number.max": "El puerto no puede superar 65535.",
  "any.required": "El puerto es obligatorio.",
});

export const createRoomValidationScheme = Joi.object({
  name: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "El nombre de la sala es obligatorio.",
    "string.min": "El nombre de la sala debe tener al menos 3 caracteres.",
    "string.max": "El nombre de la sala no puede superar los 255 caracteres.",
    "any.required": "El nombre de la sala es obligatorio.",
  }),
  description: Joi.string().trim().allow("").max(255).optional().messages({
    "string.max": "La descripción no puede superar los 255 caracteres.",
  }),
  isPrivate: Joi.boolean().default(false),
  roomPassword: Joi.when("isPrivate", {
    is: true,
    then: Joi.string().min(4).max(50).required().messages({
      "string.empty": "La contraseña de la sala es obligatoria para salas privadas.",
      "string.min": "La contraseña de la sala debe tener al menos 4 caracteres.",
      "string.max": "La contraseña de la sala no puede superar los 50 caracteres.",
      "any.required": "La contraseña de la sala es obligatoria para salas privadas.",
    }),
    otherwise: Joi.string().allow("").max(50).optional().messages({
      "string.max": "La contraseña de la sala no puede superar los 50 caracteres.",
    }),
  }),
  serverIP,
  serverPort,
  serverPassword: Joi.string().allow("").max(80).optional().messages({
    "string.max": "La contraseña del servidor no puede superar los 80 caracteres.",
  }),
});

export const updateRoomValidationScheme = Joi.object({
  name: Joi.string().trim().min(3).max(255).optional().messages({
    "string.empty": "El nombre de la sala no puede estar vacío.",
    "string.min": "El nombre de la sala debe tener al menos 3 caracteres.",
    "string.max": "El nombre de la sala no puede superar los 255 caracteres.",
  }),
  description: Joi.string().trim().allow("").max(255).optional().messages({
    "string.max": "La descripción no puede superar los 255 caracteres.",
  }),
  isPrivate: Joi.boolean().optional(),
  roomPassword: Joi.string().allow("").min(4).max(50).optional().messages({
    "string.min": "La contraseña de la sala debe tener al menos 4 caracteres.",
    "string.max": "La contraseña de la sala no puede superar los 50 caracteres.",
  }),
  removeRoomPassword: Joi.boolean().optional(),
  serverIP: serverIP.optional(),
  serverPort: serverPort.optional(),
  serverPassword: Joi.string().allow("").max(80).optional().messages({
    "string.max": "La contraseña del servidor no puede superar los 80 caracteres.",
  }),
  removeServerPassword: Joi.boolean().optional(),
}).min(1).messages({
  "object.min": "Ingresa al menos un dato para actualizar la sala.",
});

export const roomIdParamValidationScheme = Joi.object({
  id: objectId.required(),
});

export const joinRoomValidationScheme = Joi.object({
  position: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "La posición debe ser un número.",
    "number.integer": "La posición debe ser un número entero.",
    "number.min": "La posición debe estar entre 1 y 10.",
    "number.max": "La posición debe estar entre 1 y 10.",
    "any.required": "La posición es obligatoria.",
  }),
  roomPassword: Joi.string().allow("").max(50).optional().messages({
    "string.max": "La contraseña de la sala no puede superar los 50 caracteres.",
  }),
});

export const movePlayerValidationScheme = Joi.object({
  userId: objectId.required(),
  position: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "La posición debe ser un número.",
    "number.integer": "La posición debe ser un número entero.",
    "number.min": "La posición debe estar entre 1 y 10.",
    "number.max": "La posición debe estar entre 1 y 10.",
    "any.required": "La posición es obligatoria.",
  }),
});

export const memberValidationScheme = Joi.object({
  userId: objectId.required(),
});

export default createRoomValidationScheme;
