import * as React from 'react';
import {SpotifySong} from "../../../entities/song/model/types";

interface SongInfoProps {
    song: SpotifySong;
    similarSongs: { [key: string]: number } | null | undefined;
}

const SongInfo: React.FC<SongInfoProps> = ({ song, similarSongs }) => {
    const formatValue = (value: string | number | null): string => {
        if (value === null) return 'Not available';
        if (typeof value === 'string') return value;
        return value.toLocaleString();
    };

    const sortedSimilarSongs = similarSongs
        ? Object.entries(similarSongs)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
        : [];

    return (
        <div className="song-info">
            <h2>{song.Track}</h2>
            <p>Artist: {song.Artist}</p>
            <p>Album: {song.Album_Name}</p>
            <p>Release Date: {song.Release_Date}</p>
            <p>ISRC: {song.ISRC}</p>

            <h3>Track Details:</h3>
            <ul>
                <li>All Time Rank: {formatValue(song.All_Time_Rank)}</li>
                <li>Track Score: {song.Track_Score.toFixed(2)}</li>
                <li>Explicit Track: {song.Explicit_Track === 0 ? 'No' : 'Yes'}</li>
            </ul>

            <h3>Platform Statistics:</h3>
            <ul>
                <li>Spotify Streams: {formatValue(song.Spotify_Streams)}</li>
                <li>Spotify Playlist Count: {formatValue(song.Spotify_Playlist_Count)}</li>
                <li>Spotify Playlist Reach: {formatValue(song.Spotify_Playlist_Reach)}</li>
                <li>Spotify Popularity: {formatValue(song.Spotify_Popularity)}</li>
                <li>YouTube Views: {formatValue(song.YouTube_Views)}</li>
                <li>YouTube Likes: {formatValue(song.YouTube_Likes)}</li>
                <li>YouTube Playlist Reach: {formatValue(song.YouTube_Playlist_Reach)}</li>
                <li>TikTok Posts: {formatValue(song.TikTok_Posts)}</li>
                <li>TikTok Likes: {formatValue(song.TikTok_Likes)}</li>
                <li>TikTok Views: {formatValue(song.TikTok_Views)}</li>
                <li>Apple Music Playlist Count: {formatValue(song.Apple_Music_Playlist_Count)}</li>
                <li>AirPlay Spins: {formatValue(song.AirPlay_Spins)}</li>
                <li>SiriusXM Spins: {formatValue(song.SiriusXM_Spins)}</li>
                <li>Deezer Playlist Count: {formatValue(song.Deezer_Playlist_Count)}</li>
                <li>Deezer Playlist Reach: {formatValue(song.Deezer_Playlist_Reach)}</li>
                <li>Amazon Playlist Count: {formatValue(song.Amazon_Playlist_Count)}</li>
                <li>Pandora Streams: {formatValue(song.Pandora_Streams)}</li>
                <li>Pandora Track Stations: {formatValue(song.Pandora_Track_Stations)}</li>
                <li>Soundcloud Streams: {formatValue(song.Soundcloud_Streams)}</li>
                <li>Shazam Counts: {formatValue(song.Shazam_Counts)}</li>
                <li>TIDAL Popularity: {formatValue(song.TIDAL_Popularity)}</li>
            </ul>

            <h3>Similar Songs:</h3>
            {sortedSimilarSongs.length > 0 ? (
                <ul>
                    {sortedSimilarSongs.map(([url, similarity]) => (
                        <li key={url}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {url.split('/').pop()} - Similarity: {similarity.toFixed(2)}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No similar songs available.</p>
            )}
        </div>
    );
};

export default SongInfo;