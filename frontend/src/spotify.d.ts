interface Window {
    Spotify: typeof Spotify;
    onSpotifyWebPlaybackSDKReady: () => void;
}

interface PlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
}

declare namespace Spotify {
    interface Player {
        connect(): Promise<boolean>;
        disconnect(): void;
        addListener(event: string, callback: (state: any) => void): boolean;
        removeListener(event: string, callback: (state: any) => void): boolean;
        getCurrentState(): Promise<PlaybackState | null>;
        setName(name: string): Promise<void>;
        getVolume(): Promise<number>;
        setVolume(volume: number): Promise<void>;
        pause(): Promise<void>;
        resume(): Promise<void>;
        togglePlay(): Promise<void>;
        seek(position_ms: number): Promise<void>;
        previousTrack(): Promise<void>;
        nextTrack(): Promise<void>;
    }

    interface PlaybackState {
        context: {
            uri: string;
            metadata: any;
        };
        disallows: {
            pausing: boolean;
            peeking_next: boolean;
            peeking_prev: boolean;
            resuming: boolean;
            seeking: boolean;
            skipping_next: boolean;
            skipping_prev: boolean;
        };
        duration: number;
        paused: boolean;
        position: number;
        repeat_mode: number;
        shuffle: boolean;
        track_window: {
            current_track: Track;
            next_tracks: Track[];
            previous_tracks: Track[];
        };
    }

    interface Track {
        id: string;
        name: string;
        uri: string;
        duration_ms: number;
        artists: Artist[];
        album: Album;
    }

    interface Artist {
        name: string;
        uri: string;
    }

    interface Album {
        name: string;
        uri: string;
        images: Image[];
    }

    interface Image {
        url: string;
    }
}