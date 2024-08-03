import * as React from 'react';
import { SpotifySong } from '../../../entities/song/model/types';

interface SongInfoProps {
    song: SpotifySong;
    similarSongs: { [key: string]: number };
}

const SongInfo: React.FC<SongInfoProps> = ({ song, similarSongs }) => {
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    const sortedSimilarSongs = Object.entries(similarSongs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    console.log(song)
    return (
        <div className="song-info">
            <h2>{song.track_name}</h2>
            <p>Artist: {song.artist_name}</p>
            <p>Release Date: {`${song.released_year}-${song.released_month}-${song.released_day}`}</p>
            <p>Duration: {formatDuration(song.duration_ms)}</p>
            <p>Streams: {song.streams ? song.streams.toLocaleString() : 'N/A'}</p>

            <h3>Audio Features:</h3>
            <ul>
                <li>Spotify Streams: {song.Spotify_Streams?.toLocaleString() ?? 'N/A'}</li>
                <li>Spotify Popularity: {song.Spotify_Popularity ?? 'N/A'}</li>
                <li>Spotify Playlist Count: {song.Spotify_Playlist_Count?.toLocaleString() ?? 'N/A'}</li>
                <li>Spotify Playlist Reach: {song.Spotify_Playlist_Reach?.toLocaleString() ?? 'N/A'}</li>
                <li>YouTube Views: {song.YouTube_Views?.toLocaleString() ?? 'N/A'}</li>
                <li>YouTube Likes: {song.YouTube_Likes?.toLocaleString() ?? 'N/A'}</li>
                <li>TikTok Posts: {song.TikTok_Posts?.toLocaleString() ?? 'N/A'}</li>
                <li>TikTok Likes: {song.TikTok_Likes?.toLocaleString() ?? 'N/A'}</li>
                <li>TikTok Views: {song.TikTok_Views?.toLocaleString() ?? 'N/A'}</li>
                <li>Track Score: {song.Track_Score?.toFixed(2) ?? 'N/A'}</li>
                <li>All Time Rank: {song.All_Time_Rank ?? 'N/A'}</li>
            </ul>

            <h3>Similar Songs:</h3>
            <ul>
                {sortedSimilarSongs.map(([url, similarity]) => (
                    <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {url.split('/').pop()} - Similarity: {similarity.toFixed(2)}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongInfo;