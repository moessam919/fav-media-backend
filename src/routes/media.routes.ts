import { Router } from "express";
import multer from "multer";
import {
    createMedia,
    getAllMedia,
    updateMedia,
    deleteMedia,
} from "../controllers/media.controller";
import { upload } from "../middlewares/upload.middleware";
import { authRequired } from "../middlewares/auth.middleware";
import { mediaSchema } from "../validators/media.validator";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(authRequired);

router.post("/", upload.single("poster"), validate(mediaSchema), createMedia);

router.get("/", getAllMedia);
router.put("/:id", upload.single("poster"), updateMedia);
router.delete("/:id", deleteMedia);

// Error handling for multer
router.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res
                .status(400)
                .json({ error: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ error: error.message });
    }
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

export default router;
