"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const register = async (email, password) => {
    const hashed = await bcrypt_1.default.hash(password, 10);
    return prisma.user.create({ data: { email, password: hashed } });
};
exports.register = register;
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("📧 Email:", email);
    console.log("🔐 Password (plain):", password);
    console.log("🧑‍💻 User from DB:", user);
    if (!user) {
        console.log("❌ No user found");
        throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    console.log("🔍 Password match:", isPasswordMatch);
    if (!isPasswordMatch) {
        console.log("❌ Password mismatch");
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });
    return { token };
};
exports.login = login;
