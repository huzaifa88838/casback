import { Router } from "express";
import { logouting } from "../middlewares/auth.middleware.js";
import { createtweet, getusertweets, updatetweet } from "../controllers/tweet.controller.js";

const router = Router()
router.use(logouting)
router.route("/cre").post(createtweet)
router.route("/gett").get(getusertweets)
router.route("/up").patch(updatetweet)

export default router