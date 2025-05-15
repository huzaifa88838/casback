import { Router } from "express";
import { logouting } from "../middlewares/auth.middleware.js";
import { likeoncomment, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()
router.use(logouting)
router.route("/toggle/v/:videoId").post(toggleVideoLike)
router.route("/toggle/c/:comment").post(likeoncomment)


export default router