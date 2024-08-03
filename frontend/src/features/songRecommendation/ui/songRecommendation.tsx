import React, { useState, useEffect } from 'react';
import { SpotifySong, SongSimilarity } from '../../../entities/song/model/types';
import "./songRecommendation.css"

interface SongRecommendationProps {
    selectedSong: SpotifySong | null;
    songs: SpotifySong[];
    similarities: SongSimilarity;
    onSongSelect: (song: SpotifySong) => void;
}

const SongRecommendation: React.FC<SongRecommendationProps> = ({
                                                                   selectedSong,
                                                                   songs,
                                                                   similarities,
                                                                   onSongSelect,
                                                               }) => {
    const [recommendations, setRecommendations] = useState<SpotifySong[]>([]);

    useEffect(() => {
        if (selectedSong && similarities[selectedSong.spotify_url]) {
            const similarSongs = Object.entries(similarities[selectedSong.spotify_url])
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([url]) => songs.find(song => song.spotify_url === url))
                .filter((song): song is SpotifySong => !!song);

            setRecommendations(similarSongs);
        } else {
            setRecommendations([]);
        }
    }, [selectedSong, similarities, songs]);

    if (!selectedSong) {
        return <div>Select a song to get recommendations</div>;
    }

    return (
        <div className="song-recommendation">
            <h3>Recommended Songs</h3>
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map((song) => (
                        <li key={song.spotify_url}>
                            <button onClick={() => onSongSelect(song)}>
                                {song.track_name} - {song.artist_name}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations found for this song.</p>
            )}
        </div>
    );
};

export default SongRecommendation;