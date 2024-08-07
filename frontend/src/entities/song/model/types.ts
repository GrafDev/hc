// src/entities/song/model/types.ts


export interface SongNode {
    id: string;
    x: number;
    y: number;
    radius: number;
    song: SpotifySong;
}

export interface SongEdge {
    source: string;
    target: string;
    similarity: number;
}

export interface SongSimilarity {
    [songId: string]: { [otherSongId: string]: number };
}

export interface SongCluster {
    id: string;
    songs: SpotifySong[];
    centroid: { x: number; y: number };
}

export type SimilarityMetric = 'jaccard' | 'cosine' | 'euclidean'| 'levenshtein' ;

export interface VisualizationSettings {
    similarityThreshold: number;
    maxConnections: number;
    nodeSizeScale: number;
    edgeWeightScale: number;
}

export interface SongAnalysisState {
    songs: SpotifySong[];
    nodes: SongNode[];
    edges: SongEdge[];
    similarities: SongSimilarity;
    clusters: SongCluster[];
    selectedSong: SpotifySong | null;
    similarSongs: SpotifySong[];
    visualizationSettings: VisualizationSettings;
}

export type SongAnalysisAction =
    | { type: 'SET_SONGS'; payload: SpotifySong[] }
    | { type: 'SET_NODES'; payload: SongNode[] }
    | { type: 'SET_EDGES'; payload: SongEdge[] }
    | { type: 'SET_SIMILARITIES'; payload: SongSimilarity }
    | { type: 'SET_CLUSTERS'; payload: SongCluster[] }
    | { type: 'SELECT_SONG'; payload: SpotifySong | null }
    | { type: 'SET_SIMILAR_SONGS'; payload: SpotifySong[] }
    | { type: 'UPDATE_VISUALIZATION_SETTINGS'; payload: Partial<VisualizationSettings> };

export interface SpotifySong {
    Track: string;
    Album_Name: string;
    Artist: string;
    Release_Date: string;
    ISRC: string;
    All_Time_Rank: number;
    Track_Score: number;
    Spotify_Streams: number;
    Spotify_Playlist_Count: number;
    Spotify_Playlist_Reach: number;
    Spotify_Popularity: number;
    YouTube_Views: number;
    YouTube_Likes: number;
    TikTok_Posts: number;
    TikTok_Likes: number;
    TikTok_Views: number;
    YouTube_Playlist_Reach: number;
    Apple_Music_Playlist_Count: number;
    AirPlay_Spins: number;
    SiriusXM_Spins: number;
    Deezer_Playlist_Count: number;
    Deezer_Playlist_Reach: number;
    Amazon_Playlist_Count: number;
    Pandora_Streams: number;
    Pandora_Track_Stations: number;
    Soundcloud_Streams: number;
    Shazam_Counts: number;
    TIDAL_Popularity: number;
    Explicit_Track: number;
}
