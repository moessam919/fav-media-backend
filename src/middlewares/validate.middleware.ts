import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Handle both JSON and FormData
            const dataToValidate = req.body;
            console.log("Validating data:", dataToValidate);

            schema.parse(dataToValidate);
            next();
        } catch (error: any) {
            console.error("Validation error:", error);
            return res.status(400).json({
                error: "Invalid data",
                details: error.errors,
            });
        }
    };
};
