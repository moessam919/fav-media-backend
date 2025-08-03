"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.updateMedia = exports.getAllMedia = exports.createMedia = void 0;
const MediaService = __importStar(require("../services/media.service"));
const media_validator_1 = require("../validators/media.validator");
const createMedia = async (req, res) => {
    try {
        const validated = media_validator_1.mediaSchema.parse(req.body);
        const poster = req.file?.filename;
        const media = await MediaService.createMedia({
            ...validated,
            poster,
            userId: req.userId,
        });
        const host = `${req.protocol}://${req.get("host")}`;
        const fullPoster = media.poster
            ? `${host}/uploads/${media.poster}`
            : null;
        res.status(201).json({ ...media, poster: fullPoster });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
exports.createMedia = createMedia;
const getAllMedia = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, type, year } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const mediaList = await MediaService.getFilteredMedia({ title, type, year, userId }, page, limit);
        const host = `${req.protocol}://${req.get("host")}`;
        const mediaWithFullPoster = mediaList.map((media) => ({
            ...media,
            poster: media.poster ? `${host}/uploads/${media.poster}` : null,
        }));
        res.json(mediaWithFullPoster);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch media" });
    }
};
exports.getAllMedia = getAllMedia;
const updateMedia = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.userId;
        const validated = media_validator_1.mediaSchema.parse(req.body);
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
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
exports.updateMedia = updateMedia;
const deleteMedia = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.userId;
        const existing = await MediaService.getMediaById(id);
        if (!existing || existing.userId !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }
        await MediaService.deleteMedia(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(400).json({ error: "Delete failed" });
    }
};
exports.deleteMedia = deleteMedia;
