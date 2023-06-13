import { Router as router } from "express";
import { songs } from "../Class/songs";
import getSpotifyInstance from "../Class/spotify";
import { YouTube } from "youtube-sr";

export const Router = router();
const Spotify = getSpotifyInstance();
const Songs = new songs();

Router.get('/:id', async (req, res) => { 
    const { id } = req.params;
    const track = await Spotify.getTrack(id);

    if (track == null) { 
        res.status(404);
        res.send("Could not find track on Spotify");
        //todo: Remove the track from the database
        return;
    }

    res.send({
        id: track.id,
        title: track.name,
        iamge: track.album.images[0].url,
        artist: track.artists[0].name,
        duration: track.duration_ms
    });
})

Router.get('/:id/convert', async (req, res) => {
    var { id } = req.params;

    var song = await Songs.get(id, 1);
    var video;
    
    if (song == null) {
        const track = await Spotify.getTrack(id);

        if (track == null) {
            res.status(404);
            res.send("Could not find track on Spotify");
            return;
        }

        video = await YouTube.searchOne(`${track.artists[0].name} - ${track.name}`, "video", false);

        if (!video?.id) {
            res.status(404);
            res.send("Could not find video on Youtube");
            return;
        }

        id = await Songs.create(track.id, video?.id);

    } else {
        video = await YouTube.getVideo(`https://youtube.com/watch?v=${song.youtube}`);   
        
        if (video == null) { 
            res.status(404);
            res.send("Could not find video on Youtube");
            //todo: Remove the track from the database
            return;
        }
    }
        
    res.send({
        id,
        youtube: {
            id: video.id,
            title: video.title,
            image: video.thumbnail?.url,
            artist: video.channel?.name,
            duration: video.duration
        }
    })
})