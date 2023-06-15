import got from "got";
import * as spotifyInterface from "./spotifyInterfaces";

class Spotify {
    authToken: string;
    accessToken!: string;
    lastAccessTokenTime: number;
    constructor(appId: string, appSecret: string) {
        this.authToken = Buffer.from(`${appId}:${appSecret}`).toString('base64');
        this.lastAccessTokenTime = 0;
    }

    protected async sendRequest(url: string): Promise<any>{
        await this.getAccessToken();
        const response = await got(url, {
            headers: { 'Authorization': 'Bearer ' + this.accessToken },
            responseType: 'json'
        }).json();
        return response;
    }

    async getAccessToken(): Promise<string> {
        if ((Date.now() - this.lastAccessTokenTime) > 3600) {
            const response: spotifyInterface.ClientCredentialsResponse = await got("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + this.authToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                responseType: 'json'
            }).json();

            this.accessToken = response['access_token'];
            this.lastAccessTokenTime = Date.now();
        }
        
        return this.accessToken;
    }

    async getTrack(id: string): Promise<spotifyInterface.Track | null> {
        const response: spotifyInterface.Track | spotifyInterface.Error = await this.sendRequest(`https://api.spotify.com/v1/tracks/${id}`);

        //@ts-ignore
        if (response?.error != undefined) {  
            return null;
        }

        //@ts-ignore
        return response;
    }

    async getTrackImage(id: string): Promise<object | null> { 
        const track = await this.getTrack(id);

        if (track == null) {
            return null;
        }

        const image = await got(track.album.images[0].url);
        return image.rawBody;
    }

    async searchTrack(query: string): Promise<spotifyInterface.Track | null> {
        const response = await this.sendRequest(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`);

        //@ts-ignore
        if (response?.error != undefined) {  
            return null;
        }

        return response.tracks.items[0];
    }
}

var instance: Spotify | undefined = undefined;

export default function getSpotifyInstance(appId: string | undefined = undefined, appSecret: string | undefined = undefined): Spotify{
    if (!appId || !appSecret) { 
        appId = process.env.SPOTIFY_ID;
        appSecret = process.env.SPOTIFY_SECRET;
    }

    if (!appId || !appSecret) { 
        throw new Error("Spotify credentials must be provided by eather as environment variables or paramater")
    }

    if (instance == undefined) {
        instance = new Spotify(appId, appSecret);
    }

    return instance;
}