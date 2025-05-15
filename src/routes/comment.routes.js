import { Router } from "express";
import app from "../app.js";

import { logouting } from "../middlewares/auth.middleware.js";
import { addcomment, deletecomment, getVideoComments, update } from "../controllers/comment.controller.js";
const router = Router()


router.use(logouting)
router.route("/getcomment:videoId").get(getVideoComments)
router.route("/add:videoId").post(addcomment)
router.route("/up:videoId").patch(update)
router.route("/de : videoId").delete(deletecomment)

export default router