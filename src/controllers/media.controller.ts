import { Request, Response } from "express";
import * as MediaService from "../services/media.service";
import { mediaSchema } from "../validators/media.validator";

export const createMedia = async (req: Request, res: Response) => {
    try {
        console.log("=== CREATE MEDIA DEBUG ===");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        console.log("User ID:", (req as any).userId);
        console.log("Content-Type:", req.headers["content-type"]);

        const validated = mediaSchema.parse(req.body);
        console.log("Validated data:", validated);

        const poster = req.file?.filename;
        console.log("Poster filename:", poster);

        const dataToSend = {
            ...validated,
            poster,
            userId: (req as any).userId,
        };
        console.log("Data to send to Prisma:", dataToSend);

        const media = await MediaService.createMedia(dataToSend);

        const host = `${req.protocol}://${req.get("host")}`;
        const fullPoster = media.poster
            ? `${host}/uploads/${media.poster}`
            : null;

        res.status(201).json({ ...media, poster: fullPoster });
    } catch (err) {
        console.error("Create media error:", err);
        res.status(400).json({ error: err });
    }
};

export const getAllMedia = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { title, type, year } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const mediaList = await MediaService.getFilteredMedia(
            { title, type, year, userId },
            page,
            limit
        );

        const host = `${req.protocol}://${req.get("host")}`;
        const mediaWithFullPoster = mediaList.map((media) => ({
            ...media,
            poster: media.poster ? `${host}/uploads/${media.poster}` : null,
        }));

        res.json(mediaWithFullPoster);
    } catch {
        res.status(500).json({ error: "Failed to fetch media" });
    }
};

export const updateMedia = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = (req as any).userId;
        const validated = mediaSchema.parse(req.body);
        const poster = req.file?.filename;

        const existing = await MediaService.getMediaById(id);
        if (!existing || existing.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        const updated = await MediaService.updateMedia(id, {
            ...validated,
            ...(poster ? { poster } : {}),
        });

        const host = `${req.protocol}://${req.get("host")}`;
        const fullPoster = updated.poster
            ? `${host}/uploads/${updated.poster}`
            : null;

        res.json({ ...updated, poster: fullPoster });
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

export const deleteMedia = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = (req as any).userId;

        const existing = await MediaService.getMediaById(id);
        if (!existing || existing.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        await MediaService.deleteMedia(id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: "Delete failed" });
    }
};
