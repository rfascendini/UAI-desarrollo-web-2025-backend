import type { Request, Response, NextFunction } from "express";
import type { Schema, ValidationResult } from "joi";
import { validationError, type FieldErrors } from "../utils/responses.js";

const validationMiddleware = (schema: Schema, target: "body" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value }: ValidationResult = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.reduce<FieldErrors>((fieldErrors, detail) => {
        const key = detail.path.join(".") || "general";
        fieldErrors[key] ??= [];
        fieldErrors[key].push(detail.message);
        return fieldErrors;
      }, {});

      return validationError(res, errors);
    }

    req[target] = value;
    next();
  };
};

export default validationMiddleware;
