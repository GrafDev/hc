import * as React from 'react';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    UnorderedList,
    ListItem,
    Link,
} from '@chakra-ui/react';
import { SpotifySong } from "../../../entities/song/model/types";

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
        <Box px={2} py={1}>
            <Heading as="h2" size="xl" mb={4}>{song.Track}</Heading>
            <Text>Artist: {song.Artist}</Text>
            <Text>Album: {song.Album_Name}</Text>
            <Text>Release Date: {song.Release_Date}</Text>
            <Text>ISRC: {song.ISRC}</Text>

            <Heading as="h3" size="lg" mt={6} mb={2}>Track Details:</Heading>
            <UnorderedList>
                <ListItem>All Time Rank: {formatValue(song.All_Time_Rank)}</ListItem>
                <ListItem>Track Score: {song.Track_Score.toFixed(2)}</ListItem>
                <ListItem>Explicit Track: {song.Explicit_Track === 0 ? 'No' : 'Yes'}</ListItem>
            </UnorderedList>

            <Heading as="h3" size="lg" mt={6} mb={2}>Platform Statistics:</Heading>
            <UnorderedList>
                <ListItem>Spotify Streams: {formatValue(song.Spotify_Streams)}</ListItem>
                <ListItem>Spotify Playlist Count: {formatValue(song.Spotify_Playlist_Count)}</ListItem>
                <ListItem>Spotify Playlist Reach: {formatValue(song.Spotify_Playlist_Reach)}</ListItem>
                <ListItem>Spotify Popularity: {formatValue(song.Spotify_Popularity)}</ListItem>
                <ListItem>YouTube Views: {formatValue(song.YouTube_Views)}</ListItem>
                <ListItem>YouTube Likes: {formatValue(song.YouTube_Likes)}</ListItem>
                <ListItem>YouTube Playlist Reach: {formatValue(song.YouTube_Playlist_Reach)}</ListItem>
                <ListItem>TikTok Posts: {formatValue(song.TikTok_Posts)}</ListItem>
                <ListItem>TikTok Likes: {formatValue(song.TikTok_Likes)}</ListItem>
                <ListItem>TikTok Views: {formatValue(song.TikTok_Views)}</ListItem>
                <ListItem>Apple Music Playlist Count: {formatValue(song.Apple_Music_Playlist_Count)}</ListItem>
                <ListItem>AirPlay Spins: {formatValue(song.AirPlay_Spins)}</ListItem>
                <ListItem>SiriusXM Spins: {formatValue(song.SiriusXM_Spins)}</ListItem>
                <ListItem>Deezer Playlist Count: {formatValue(song.Deezer_Playlist_Count)}</ListItem>
                <ListItem>Deezer Playlist Reach: {formatValue(song.Deezer_Playlist_Reach)}</ListItem>
                <ListItem>Amazon Playlist Count: {formatValue(song.Amazon_Playlist_Count)}</ListItem>
                <ListItem>Pandora Streams: {formatValue(song.Pandora_Streams)}</ListItem>
                <ListItem>Pandora Track Stations: {formatValue(song.Pandora_Track_Stations)}</ListItem>
                <ListItem>Soundcloud Streams: {formatValue(song.Soundcloud_Streams)}</ListItem>
                <ListItem>Shazam Counts: {formatValue(song.Shazam_Counts)}</ListItem>
                <ListItem>TIDAL Popularity: {formatValue(song.TIDAL_Popularity)}</ListItem>
            </UnorderedList>

            <Heading as="h3" size="lg" mt={6} mb={2}>Similar Songs:</Heading>
            {sortedSimilarSongs.length > 0 ? (
                <VStack align="stretch">
                    {sortedSimilarSongs.map(([url, similarity]) => (
                        <HStack key={url}>
                            <Link href={url} isExternal color="blue.500">
                                {url.split('/').pop()}
                            </Link>
                            <Text>- Similarity: {similarity.toFixed(2)}</Text>
                        </HStack>
                    ))}
                </VStack>
            ) : (
                <Text>No similar songs available.</Text>
            )}
        </Box>
    );
};

export default SongInfo;