import { Router } from "express";
import {
    createMedia,
    getAllMedia,
    updateMedia,
    deleteMedia,
} from "../controllers/media.controller";

import { upload } from "../middlewares/upload.middleware";
import { authRequired } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Require auth on ALL routes
router.use(authRequired);

router.post("/", upload.single("poster"), createMedia);
router.get("/", getAllMedia);
router.put("/:id", upload.single("poster"), updateMedia);
router.delete("/:id", deleteMedia);

export default router;
