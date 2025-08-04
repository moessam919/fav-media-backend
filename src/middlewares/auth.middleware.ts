import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authRequired = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {
            id: number;
        };
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
