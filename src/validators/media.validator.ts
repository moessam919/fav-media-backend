import { z } from "zod";

export const mediaSchema = z.object({
    title: z.string().min(1),
    type: z.enum(["Movie", "TV Show"]),
    director: z.string().min(1),
    budget: z.string().min(1),
    location: z.string().min(1),
    duration: z.string().min(1),
    year: z
        .string()
        .min(1)
        .regex(/^\d{4}$/, "Year must be 4 digits"),
    poster: z.any().optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
