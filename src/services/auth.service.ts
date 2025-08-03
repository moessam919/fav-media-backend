import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { email, password: hashed } });
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    console.log("📧 Email:", email);
    console.log("🔐 Password (plain):", password);
    console.log("🧑‍💻 User from DB:", user);

    if (!user) {
        console.log("❌ No user found");
        throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
        console.log("❌ Password mismatch");
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
        expiresIn: "1d",
    });

    return { token };
};
