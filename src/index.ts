import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mediaRoutes from "./routes/media.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/media", mediaRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);

// Test validation endpoint (no auth required)
app.post("/api/test-validation", (req, res) => {
    try {
        const { mediaSchema } = require("./validators/media.validator");
        console.log("Test validation - request body:", req.body);
        
        const validated = mediaSchema.parse(req.body);
        res.json({
            message: "Validation successful",
            data: validated,
        });
    } catch (error: any) {
        console.error("Validation test error:", error);
        res.status(400).json({
            error: "Validation failed",
            details: error.errors,
        });
    }
});

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!",
        timestamp: new Date().toISOString(),
    });
});

// Database test endpoint
app.get("/api/test-db", async (req, res) => {
    try {
        const { PrismaClient } = require("@prisma/client");
        const prisma = new PrismaClient();
        
        // Test database connection
        await prisma.$connect();
        
        // Test a simple query
        const userCount = await prisma.user.count();
        
        res.json({
            message: "Database connection successful",
            userCount,
            timestamp: new Date().toISOString(),
        });
        
        await prisma.$disconnect();
    } catch (error: any) {
        console.error("Database test error:", error);
        res.status(500).json({
            error: "Database connection failed",
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
