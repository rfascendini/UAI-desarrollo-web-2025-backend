import Joi from "joi";

const objectId = Joi.string().hex().length(24);
const serverIP = Joi.string().trim().ip({ version: ["ipv4"], cidr: "optional" }).required();
const serverPort = Joi.number().integer().min(1).max(65535).required();

export const createRoomValidationScheme = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  description: Joi.string().trim().allow("").max(200).optional(),
  isPrivate: Joi.boolean().default(false),
  roomPassword: Joi.when("isPrivate", {
    is: true,
    then: Joi.string().min(4).max(50).required(),
    otherwise: Joi.string().allow("").max(50).optional(),
  }),
  serverIP,
  serverPort,
  serverPassword: Joi.string().allow("").max(80).optional(),
});

export const updateRoomValidationScheme = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional(),
  description: Joi.string().trim().allow("").max(200).optional(),
  isPrivate: Joi.boolean().optional(),
  roomPassword: Joi.string().allow("").min(4).max(50).optional(),
  removeRoomPassword: Joi.boolean().optional(),
  serverIP: serverIP.optional(),
  serverPort: serverPort.optional(),
  serverPassword: Joi.string().allow("").max(80).optional(),
  removeServerPassword: Joi.boolean().optional(),
}).min(1);

export const roomIdParamValidationScheme = Joi.object({
  id: objectId.required(),
});

export const joinRoomValidationScheme = Joi.object({
  position: Joi.number().integer().min(1).max(10).required(),
  roomPassword: Joi.string().allow("").max(50).optional(),
});

export const movePlayerValidationScheme = Joi.object({
  userId: objectId.required(),
  position: Joi.number().integer().min(1).max(10).required(),
});

export const memberValidationScheme = Joi.object({
  userId: objectId.required(),
});

export default createRoomValidationScheme;
