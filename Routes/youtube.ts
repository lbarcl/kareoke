import { Router } from "express";
import { YouTube } from "youtube-sr";
import { songs } from "../Class/songs";
import getSpotifyInstance from "../Class/spotify";

export const router = Router();
const Songs = new songs();
const Spotify = getSpotifyInstance();

router.get('/:id', async (req, res) => { 
    const { id } = req.params;
    const video = await YouTube.getVideo(`https://youtube.com/watch?v=${id}`);
    
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
})


router.get('/:id/convert', async (req, res) => {
    var { id } = req.params;

    var song = await Songs.get(id, 2);
    var track;
    
    if (song == null) {
        const video = await YouTube.getVideo(`https://youtube.com/watch?v=${id}`);   
        
        if (video == null) {
            res.status(404);
            res.send("Could not find video on YouTube");
            return;
        }
        
        //@ts-ignore
        track = await Spotify.searchTrack(video.title);

        
        if (track == null) {
            res.status(404);
            res.send("Could not find track on Spotify");
            return;
        }
        
        //@ts-ignore
        id = await Songs.create(track.id, video?.id);
        
    } else {
        track = await Spotify.getTrack(song.id);
        
        if (track == null) { 
            res.status(404);
            res.send("Could not find track on Spotify");
            //todo: Remove the track from the database
            return;
        }
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
    })
})

router.get('/search', async (req, res) => { 
    const { query } = req.query;

    if (!query || query == '') { 
        res.status(400);
        res.send("No given search query");
        return;
    }

    const video = await YouTube.searchOne(query.toString(), "video", false);

    if (video == null) { 
        res.status(404);
        res.send("No search result found");
        return;
    }

    res.send({
        id: video.id,
        title: video.title,
        image: video.thumbnail?.url,
        artist: video.channel?.name,
        duration: video.duration
    });
})