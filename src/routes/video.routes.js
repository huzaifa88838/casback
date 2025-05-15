import { Router } from 'express';

import {logouting} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import { deletevideo, getAllVideos, getVideoById, togglepublishstatus, updatevideo, uploadvideo } from '../controllers/video.controller.js';

const router = Router();
router.use(logouting); // Apply verifyJWT middleware to all routes in this file
router.route("/get").get(getAllVideos)
router.route("/upload").post(
upload.fields([
    {
        name: "videofile",
maxcount: 1
},
{
    name: "thumbnail",
    maxcount: 1
}

]),

uploadvideo)
router.route("/byid").get(getVideoById)
router.route("/update").patch(updatevideo)
router.route("/deleted").get(deletevideo)
router.route("/toggle/publish/:owner").patch(togglepublishstatus)

export default router;