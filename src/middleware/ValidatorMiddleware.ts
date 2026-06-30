import type { Request, Response, NextFunction } from "express";
import type { Schema, ValidationResult } from "joi";

const validationMiddleware = (schema: Schema, target: "body" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value }: ValidationResult = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Datos invalidos",
        detail: error.details.map((d) => d.message),
      });
    }
    req[target] = value;
    next();
  };
};

export default validationMiddleware;
