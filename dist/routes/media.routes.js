"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("../controllers/media.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ✅ Require auth on ALL routes
router.use(auth_middleware_1.authRequired);
router.post("/", upload_middleware_1.upload.single("poster"), media_controller_1.createMedia);
router.get("/", media_controller_1.getAllMedia);
router.put("/:id", upload_middleware_1.upload.single("poster"), media_controller_1.updateMedia);
router.delete("/:id", media_controller_1.deleteMedia);
exports.default = router;
