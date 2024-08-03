import * as React from 'react';
import {SpotifySong} from "../../../entities/song/model/types";


interface SongInfoProps {
    song: SpotifySong;
    similarSongs: { [key: string]: number };
}

const SongInfo: React.FC<SongInfoProps> = ({ song, similarSongs }) => {
    const formatValue = (value: string | number | null): string => {
        if (value === null) return 'Not available';
        if (typeof value === 'string') return value;
        return value.toLocaleString();
    };

    const sortedSimilarSongs = Object.entries(similarSongs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="song-info">
            <h2>{song.Track}</h2>
            <p>Artist: {song.Artist}</p>
            <p>Album: {song["Album Name"]}</p>
            <p>Release Date: {song["Release Date"]}</p>
            <p>ISRC: {song.ISRC}</p>

            <h3>Track Details:</h3>
            <ul>
                <li>All Time Rank: {formatValue(song["All Time Rank"])}</li>
                <li>Track Score: {song["Track Score"].toFixed(2)}</li>
                <li>Explicit Track: {song["Explicit Track"] === 0 ? 'No' : 'Yes'}</li>
            </ul>

            <h3>Platform Statistics:</h3>
            <ul>
                <li>Spotify Streams: {formatValue(song["Spotify Streams"])}</li>
                <li>Spotify Playlist Count: {formatValue(song["Spotify Playlist Count"])}</li>
                <li>Spotify Playlist Reach: {formatValue(song["Spotify Playlist Reach"])}</li>
                <li>Spotify Popularity: {formatValue(song["Spotify Popularity"])}</li>
                <li>YouTube Views: {formatValue(song["YouTube Views"])}</li>
                <li>YouTube Likes: {formatValue(song["YouTube Likes"])}</li>
                <li>YouTube Playlist Reach: {formatValue(song["YouTube Playlist Reach"])}</li>
                <li>TikTok Posts: {formatValue(song["TikTok Posts"])}</li>
                <li>TikTok Likes: {formatValue(song["TikTok Likes"])}</li>
                <li>TikTok Views: {formatValue(song["TikTok Views"])}</li>
                <li>Apple Music Playlist Count: {formatValue(song["Apple Music Playlist Count"])}</li>
                <li>AirPlay Spins: {formatValue(song["AirPlay Spins"])}</li>
                <li>SiriusXM Spins: {formatValue(song["SiriusXM Spins"])}</li>
                <li>Deezer Playlist Count: {formatValue(song["Deezer Playlist Count"])}</li>
                <li>Deezer Playlist Reach: {formatValue(song["Deezer Playlist Reach"])}</li>
                <li>Amazon Playlist Count: {formatValue(song["Amazon Playlist Count"])}</li>
                <li>Pandora Streams: {formatValue(song["Pandora Streams"])}</li>
                <li>Pandora Track Stations: {formatValue(song["Pandora Track Stations"])}</li>
                <li>Soundcloud Streams: {formatValue(song["Soundcloud Streams"])}</li>
                <li>Shazam Counts: {formatValue(song["Shazam Counts"])}</li>
                <li>TIDAL Popularity: {formatValue(song["TIDAL Popularity"])}</li>
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