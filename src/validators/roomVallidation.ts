import Joi from "joi";

const createRoomValidationScheme = Joi.object({
  name: Joi.string().min(3).max(15).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.min": `"name" should have a minimum length of 3`,
    "string.max": `"name" should have a maximum length of 15`,
    "any.required": `"name" is a required field`,
  }),
  users: Joi.array().min(1).required().messages({
    "array.base": `"Users" should be a type of 'User'`,
    "array.min": `"Users" should have a minimum length of 1`,
    "any.required": `"Users" is a required field`,
  }),
  description: Joi.string().min(3).max(15).required().messages({
    "string.base": `"description" should be a type of 'text'`,
    "string.min": `"description" should have a minimum length of 3`,
    "string.max": `"description" should have a maximum length of 15`,
    "any.required": `"description" is a required field`,
  }),
  max_players: Joi.number().min(1).max(99).required().messages({
    "number.base": `"max_players" should be a type of 'number'`,
    "number.min": `"max_players" should have a minimum length of 1`,
    "number.max": `"max_players" should have a maximum length of 99`,
    "any.required": `"max_players" is a required field`,
  }),
  isPrivate: Joi.boolean().messages({
    "boolean.base": `"isPrivate" should be a type of 'boolean'`,
    "any.boolean": `"isPrivate" must be true or false`,
  }),
  password: Joi.string().min(3).max(15).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.min": `"password" should have a minimum length of 3`,
    "string.max": `"password" should have a maximum length of 15`,
    "any.required": `"password" is a required field`,
  }),
  serverIP: Joi.string()
    .ip({ version: ["ipv4"], cidr: "required" })
    .required()
    .messages({
      "string.ip": "The ip field must be a valid IPv4 address",
    }),
  serverPort: Joi.number().min(1).max(4).required().messages({
    "number.base": `"serverPort" should be a type of 'number'`,
    "number.min": `"serverPort" should have a minimum length of 1`,
    "number.max": `"serverPort" should have a maximum length of 4`,
    "any.required": `"serverPort" is a required field`,
  }),
  isDeleted: Joi.boolean().messages({
    "boolean.base": `"isDeleted" should be a type of 'boolean'`,
    "any.boolean": `"isDeleted" must be true or false`,
  }),
});

export default createRoomValidationScheme;

/* name: String; listo
  users: IUser[]; para lo ultimo
  description: String;
  createdAt: Date;
  createdBy: IUser;
  max_players: Number,
  isPrivate: Boolean,
  password: String,
  serverIP: String,
  serverPort: Number,
  isDeleted: Boolean */
