import { Router } from "express";
import { songs as Songs } from "../Class/songs";
import GetSpotify from "../Class/spotify";
import { YouTube } from "youtube-sr";

export const router = Router();
const spotify = GetSpotify();
const songs = new Songs();

router.post("/", async (req, res) => {
    const { yid, sid } = req.query;

    if (!yid || !sid) {
        res.status(400);
        res.send("Missing youtube ID or Spotify ID");
        return;
    }

    try {
        const id = await songs.create(sid.toString(), yid.toString());

        res.send({
            id,
            spotify: sid,
            youtube: yid
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

router.get("/search", async (req, res) => {
    const { q } = req.query;
    res.setHeader('Cache-Control', 'no-cache');

    if (q == undefined) {
        res.status(400);
        res.send("Missing query string");
        return;
    }

    const track = await spotify.searchTrack(q.toString());
    const song = await songs.get(track.id, 1);

    if (song == null) {
        const video = await YouTube.searchOne(`${track.artists[0].name} - ${track.name}`, "video", false);

        if (video?.id) {
            const id = await songs.create(track.id, video.id);
            res.send({
                id,
                spotify: track.id,
                youtube: video.id
            });
        } else {
            res.status(404);
            res.send("No song found");
        }

    } else {
        res.send(song);
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    const song = await songs.get(id);

    if (song == null) {
        res.status(404);
        res.send("Could not find song on database");
        return;
    }

    const track = await spotify.getTrack(song.spotify);
    const video = await YouTube.getVideo(`https://youtube.com/watch?v=${song.youtube}`);

    if (track == null) {
        res.status(404);
        res.send("Could not find track on Spotify");
        //todo: Remove the track from the database
        return;
    } else if (video == null) { 
        res.status(404);
        res.send("Could not find video on Youtube");
        //todo: Remove the track from the database
        return;
    }

    res.send({
        id,
        spotify: {
            id: track.id,
            title: track.name,
            iamge: track.album.images[0].url,
            artist: track.artists[0].name,
            duration: track.duration_ms
        },
        youtube: {
            id: video.id,
            title: video.title,
            image: video.thumbnail?.url,
            artist: video.channel?.name,
            duration: video.duration
        }
    })
});

router.get('/:id/spotify', async (req, res) => {
    const { id } = req.params;

    const song = await songs.get(id);

    if (song == null) {
        res.status(404);
        res.send("Could not find song on database");
        return;
    }

    const track = await spotify.getTrack(song.spotify);

    if (track == null) { 
        res.status(404);
        res.send("Could not find track on spotify");
        //todo: Remove the track from the database
        return;
    }

    res.send({
        id: track.id,
        title: track.name,
        iamge: track.album.images[0].url,
        artist: track.artists[0].name,
        duration: track.duration_ms
    })
});

router.get('/:id/youtube', async (req, res) => {
    const { id } = req.params

    const song = await songs.get(id);

    if (song == null) {
        res.status(404);
        res.send("Could not find song on database");
        return;
    }

    const video = await YouTube.getVideo(`https://youtube.com/watch?v=${song.youtube}`);

    if (video == null) { 
        res.status(404);
        res.send("Could not find video on Youtube");
        //todo: Remove the track from the database
        return;
    }

    res.send({
        id: video.id,
        title: video.title,
        image: video.thumbnail?.url,
        artist: video.channel?.name,
        duration: video.duration
    })
});

router.get('/:id/image', async (req, res) => {
    const { id } = req.params;

    const song = await songs.get(id);

    if (song == null) {
        res.status(404);
        res.send("Could not find song on database");
        return;
    }

    const image = await spotify.getTrackImage(song.spotify);

    if (image == null) { 
        res.status(404);
        res.send("Could not find track on spotify");
        //todo: Remove the track from the database
        return;
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename=${song.spotify}.jpg`);
    res.send(image);
});