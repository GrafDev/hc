import { SpotifySong } from '../../entities/song/model/types';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

async function getAccessToken(): Promise<string> {
    if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
        return accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;
    if (accessToken === null) {
        throw new Error('Access token is null');
    }
    return accessToken;
}

export async function getTrackInfo(trackId: string): Promise<Partial<SpotifySong>> {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return {
        track_name: data.name,
        artist_name: data.artists[0].name,
        spotify_url: data.external_urls.spotify,
        duration_ms: data.duration_ms
    };
}

export async function getAudioFeatures(trackId: string): Promise<Partial<SpotifySong>> {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return {
        danceability: data.danceability,
        energy: data.energy,
        key: data.key,
        loudness: data.loudness,
        mode: data.mode,
        speechiness: data.speechiness,
        acousticness: data.acousticness,
        instrumentalness: data.instrumentalness,
        liveness: data.liveness,
        valence: data.valence,
        tempo: data.tempo
    };
}

export async function getTrackPreview(trackId: string): Promise<string | null> {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.preview_url;
}

export async function searchTracks(query: string): Promise<Partial<SpotifySong>[]> {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.tracks.items.map((item: any) => ({
        track_name: item.name,
        artist_name: item.artists[0].name,
        spotify_url: item.external_urls.spotify,
        duration_ms: item.duration_ms
    }));
}