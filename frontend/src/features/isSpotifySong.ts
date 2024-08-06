import { SpotifySong } from "../entities/song/model/types";

function isSpotifySong(obj: any): obj is SpotifySong {
    // console.log(obj)
    const requiredFields = [
        'Track', 'Album_Name', 'Artist', 'Release_Date', 'ISRC', 'All_Time_Rank', 'Track_Score',
        'Spotify_Streams', 'Spotify_Playlist_Count', 'Spotify_Playlist_Reach', 'Spotify_Popularity',
        'YouTube_Views', 'YouTube_Likes', 'TikTok_Posts', 'TikTok_Likes', 'TikTok_Views',
        'YouTube_Playlist_Reach', 'Apple_Music_Playlist_Count', 'AirPlay_Spins', 'SiriusXM_Spins',
        'Deezer_Playlist_Count', 'Deezer_Playlist_Reach', 'Amazon_Playlist_Count', 'Pandora_Streams',
        'Pandora_Track_Stations', 'Soundcloud_Streams', 'Shazam_Counts', 'TIDAL_Popularity', 'Explicit_Track'
    ];

    for (const field of requiredFields) {
        if (!(field in obj)) {
            return false;
        }
        // console.log("field",field, obj)
        // Проверка типа данных
        switch (field) {
            case 'All_Time_Rank':
            case 'Track_Score':
            case 'Spotify_Streams':
            case 'Spotify_Playlist_Count':
            case 'Spotify_Playlist_Reach':
            case 'Spotify_Popularity':
            case 'YouTube_Views':
            case 'YouTube_Likes':
            case 'TikTok_Posts':
            case 'TikTok_Likes':
            case 'TikTok_Views':
            case 'YouTube_Playlist_Reach':
            case 'Apple_Music_Playlist_Count':
            case 'AirPlay_Spins':
            case 'SiriusXM_Spins':
            case 'Deezer_Playlist_Count':
            case 'Deezer_Playlist_Reach':
            case 'Amazon_Playlist_Count':
            case 'Pandora_Streams':
            case 'Pandora_Track_Stations':
            case 'Soundcloud_Streams':
            case 'Shazam_Counts':
            case 'TIDAL_Popularity':
            case 'Explicit_Track':
                if (isNaN(Number(obj[field].replace(/,/g, '')))) {
                    return false;
                }
                break;
            default:
                if (typeof obj[field] !== 'string') {
                    return false;
                }
        }
    }

    return true;
}
export default isSpotifySong;