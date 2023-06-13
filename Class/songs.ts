import { Songs as SongCollection } from "../Database";
import { Snowflake } from "snowflake-uid";

interface SongInterface {
    id: string;
    spotify: string,
    youtube: string
}

export class songs {
    flakeId: Snowflake;
    constructor() {
        this.flakeId = new Snowflake({
            epoch: 1096107300000
        });
    }

    async create(spotifyId: string, youtubeId: string): Promise<string> {
        const id = this.flakeId.generate();

        await SongCollection.create({
            id,
            spotify: spotifyId,
            youtube: youtubeId
        })

        return id;
    }

    async get(id: string, from: number = 0): Promise<SongInterface | null> { 
        let query = {};

        switch (from) {
            case 0: 
                query = {
                    where: {
                        id: id
                    }
                }
                break;
            
            case 1: 
                query = {
                    where: {
                        spotify: id
                    }
                }
                break;
            case 2: 
                query = {
                    where: {
                        youtube: id
                    }
                }
                break; 
        }

        const song = (await SongCollection.findOne(query))?.toJSON();

        if (song == null) { 
            return null;
        }

        return {
            id: song.id,
            spotify: song.spotify,
            youtube: song.youtube
        }
    }
}