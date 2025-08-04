import { z } from "zod";

export const mediaSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Movie", "TV Show"]),
    director: z.string().min(1, "Director is required"),
    budget: z.string().min(1, "Budget is required"),
    location: z.string().min(1, "Location is required"),
    duration: z.string().min(1, "Duration is required"),
    year: z
        .string()
        .min(1, "Year is required")
        .regex(/^\d{4}$/, "Year must be 4 digits"),
    poster: z.any().optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
