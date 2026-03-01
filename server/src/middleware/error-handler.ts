import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";
import { env } from "../config";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : err.message,
  });
}
