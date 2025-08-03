import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token } = await AuthService.login(email, password);
        res.json({ token });
    } catch {
        res.status(401).json({ error: "Invalid credentials" });
    }
};
