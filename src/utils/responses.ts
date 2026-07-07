import type { Response } from "express";

export type FieldErrors = Record<string, string[]>;

export const errorResponse = (
  res: Response,
  status: number,
  message: string,
  errors: FieldErrors = {}
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

export const validationError = (
  res: Response,
  errors: FieldErrors,
  message = "Revisá los datos ingresados."
) => errorResponse(res, 422, message, errors);
