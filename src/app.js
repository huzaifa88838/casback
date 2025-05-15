import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";


const app = express();


app.use(cors({
    origin:["http://localhost:5173"],
    // origin: ["https://azaddeal.com", "https://www.azaddeal.com"], // ✅ Both with and without "www"
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allowed HTTP Methods

    credentials: true // ✅ Allow Cookies & Authentication Headers
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.json(({limit:"16kb"})))
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' })); // Allow up to 10MB for JSON payload
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Allow up to 10MB for URL-encoded data

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

import { router } from "./routes/user.routes.js";
app.use("/users",router)
import videorouter from './routes/video.routes.js'
app.use("/videos",videorouter)
import likedrouter from "./routes/like.routes.js"
app.use("/like",likedrouter)
import commentrouter from "./routes/comment.routes.js"
app.use("/comment",commentrouter)
import tweetuser from "./routes/tweet.routes.js"
app.use("/tweet",tweetuser)
export default app;