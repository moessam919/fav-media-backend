import { Router } from "express";
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

export default router;
