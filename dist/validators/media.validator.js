"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaSchema = void 0;
const zod_1 = require("zod");
exports.mediaSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    type: zod_1.z.enum(["Movie", "TV Show"]),
    director: zod_1.z.string().min(1),
    budget: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    duration: zod_1.z.string().min(1),
    year: zod_1.z.string().min(1),
    poster: zod_1.z.string().optional(),
});
