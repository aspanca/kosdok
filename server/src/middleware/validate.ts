import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const field = issue.path.join(".");
          if (!errors[field]) errors[field] = [];
          errors[field].push(issue.message);
        }
        next(ApiError.badRequest("Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
}
