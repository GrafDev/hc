import * as React from 'react';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    UnorderedList,
    ListItem,
    Button,
} from '@chakra-ui/react';

import {SpotifySong} from "../../../entities/song/model/types";
import PlayerHC from "../../PlayerHC/PlayerSpoty.tsx";
import {useMemo} from "react";

interface SongInfoProps {
    song: SpotifySong;
    similarSongs: { [key: string]: number } | null | undefined;
    onSelectSimilarSong: (url: string) => void;
}

interface FormattedListItemProps {
    label: string;
    value: string | number;
}

const FormattedListItem: React.FC<FormattedListItemProps> = ({label, value}) => (
    <ListItem>
        <Text as="span" fontWeight="bold">{label}: </Text>
        <Text as="span" fontStyle="italic">{value}</Text>
    </ListItem>
);

const SongInfo: React.FC<SongInfoProps> = ({song, similarSongs, onSelectSimilarSong}) => {
    const formatValue = (value: string | number | null): string => {
        if (value === null) return 'Not available';
        if (typeof value === 'string') return value;
        return value.toLocaleString();
    };

    const memoizedPlayer = useMemo(() => (
        <PlayerHC songName={song.Track} artist={song.Artist}/>
    ), [song.Track, song.Artist]);

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
            {memoizedPlayer}

            <Heading as="h3" size="lg" mt={6} mb={2}>Track Details:</Heading>
            <UnorderedList>
                <FormattedListItem label="All Time Rank" value={formatValue(song.All_Time_Rank)}/>
                <FormattedListItem label="Track Score" value={song.Track_Score.toFixed(2)}/>
                <FormattedListItem label="Explicit Track" value={song.Explicit_Track === 0 ? 'No' : 'Yes'}/>
            </UnorderedList>

            <Heading as="h3" size="lg" mt={6} mb={2}>Platform Statistics:</Heading>
            <UnorderedList maxHeight={"350px"} overflowY="auto">
                <FormattedListItem label="Spotify Streams" value={formatValue(song.Spotify_Streams)}/>
                <FormattedListItem label="Spotify Playlist Count" value={formatValue(song.Spotify_Playlist_Count)}/>
                <FormattedListItem label="Spotify Playlist Reach" value={formatValue(song.Spotify_Playlist_Reach)}/>
                <FormattedListItem label="Spotify Popularity" value={formatValue(song.Spotify_Popularity)}/>
                <FormattedListItem label="YouTube Views" value={formatValue(song.YouTube_Views)}/>
                <FormattedListItem label="YouTube Likes" value={formatValue(song.YouTube_Likes)}/>
                <FormattedListItem label="YouTube Playlist Reach" value={formatValue(song.YouTube_Playlist_Reach)}/>
                <FormattedListItem label="TikTok Posts" value={formatValue(song.TikTok_Posts)}/>
                <FormattedListItem label="TikTok Likes" value={formatValue(song.TikTok_Likes)}/>
                <FormattedListItem label="TikTok Views" value={formatValue(song.TikTok_Views)}/>
                <FormattedListItem label="Apple Music Playlist Count"
                                   value={formatValue(song.Apple_Music_Playlist_Count)}/>
                <FormattedListItem label="AirPlay Spins" value={formatValue(song.AirPlay_Spins)}/>
                <FormattedListItem label="SiriusXM Spins" value={formatValue(song.SiriusXM_Spins)}/>
                <FormattedListItem label="Deezer Playlist Count" value={formatValue(song.Deezer_Playlist_Count)}/>
                <FormattedListItem label="Deezer Playlist Reach" value={formatValue(song.Deezer_Playlist_Reach)}/>
                <FormattedListItem label="Amazon Playlist Count" value={formatValue(song.Amazon_Playlist_Count)}/>
                <FormattedListItem label="Pandora Streams" value={formatValue(song.Pandora_Streams)}/>
                <FormattedListItem label="Pandora Track Stations" value={formatValue(song.Pandora_Track_Stations)}/>
                <FormattedListItem label="Soundcloud Streams" value={formatValue(song.Soundcloud_Streams)}/>
                <FormattedListItem label="Shazam Counts" value={formatValue(song.Shazam_Counts)}/>
                <FormattedListItem label="TIDAL Popularity" value={formatValue(song.TIDAL_Popularity)}/>
            </UnorderedList>
            <Heading as="h3" size="lg" mt={6} mb={2}>Similar Songs:</Heading>
            {sortedSimilarSongs.length > 0 ? (
                <VStack align="stretch">
                    {sortedSimilarSongs.map(([url, similarity], index) => (
                        <Button
                            key={`similar-song-${index}-${url}`}
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectSimilarSong(url)}
                        >
                            <HStack>
                                <Text>
                                    {url.split('/').pop()}
                                </Text>
                                <Text>- Similarity: {similarity.toFixed(2)}</Text>
                            </HStack>
                        </Button>
                    ))}
                </VStack>
            ) : (
                <Text>No similar songs available.</Text>
            )}
        </Box>
    );
};

export default SongInfo;