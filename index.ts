import Express from 'express';
import dotenv from "dotenv";
dotenv.config();

import * as Songs from "./Routes/songs";
import * as Spotify from "./Routes/spotify";
import * as Youtube from "./Routes/youtube";

const API = Express();
const PORT = 3169;

API.listen(PORT);
API.use("/songs", Songs.router);
API.use("/spotify", Spotify.Router);
API.use("/youtube", Youtube.router);

API.get("/test", (req, res) => { 
    res.send("OK");
});