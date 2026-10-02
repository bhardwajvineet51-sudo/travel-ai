import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errorCode: "VALIDATION_ERROR",
        details: result.error.flatten(),
      });
    }
    // Replace with parsed/coerced data
    (req as any)[source] = result.data;
    next();
  };
}
