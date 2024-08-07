import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, useToast, IconButton, HStack } from '@chakra-ui/react';
import { CiPause1, CiPlay1, CiStop1 } from "react-icons/ci";

const CLIENT_ID = '20e38d3e288f4dfc9ff435ecff30b867';
const REDIRECT_URI = 'https://hunter-corp-sa.web.app/';
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = ["user-read-private", "user-read-email", "streaming", "user-modify-playback-state"];

interface PlayerProps {
    songName: string;
    artist: string;
    trackUri?: string;
}

const PlayerSpoty: React.FC<PlayerProps> = ({ songName, artist, trackUri }) => {
    const [token, setToken] = useState<string | null>(null);
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const toast = useToast();

    const login = useCallback(() => {
        // Удаляем токен из локального хранилища перед входом
        localStorage.removeItem("token");

        const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join("%20")}`;
        window.location.href = authUrl;
    }, []);

    const checkUserAccount = useCallback(async (token: string) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.product !== 'premium') {
                toast({
                    title: "Premium Account Required",
                    description: "Spotify Web Playback SDK requires a Premium account.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking user account:', error);
            return false;
        }
    }, [toast]);

    const initializePlayer = useCallback((token: string) => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: (cb: (token: string) => void) => { cb(token); }
        });

        player.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            toast({
                title: "PlayerSpoty ready",
                description: `Device ID: ${device_id}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        });

        player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
            console.log('Device ID has gone offline', device_id);
            toast({
                title: "PlayerSpoty not ready",
                description: "The player has gone offline",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        });

        player.addListener('player_state_changed', (state: any) => {
            if (!state) return;
            setIsPlaying(!state.paused);
        });

        player.connect();
        setPlayer(player);
    }, [toast]);

    useEffect(() => {
        const getTokenFromUrl = () => {
            const hash = window.location.hash;
            if (!hash) return null;
            const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];
            window.location.hash = "";
            return token;
        };

        const initializeSDK = async () => {
            const storedToken = localStorage.getItem("token");
            const urlToken = getTokenFromUrl();

            // Если токен из URL доступен, используем его (это новый токен после входа)
            // В противном случае проверяем сохраненный токен
            const token = urlToken || storedToken;

            if (token) {
                console.log("Token obtained");
                const isPremium = await checkUserAccount(token);
                if (isPremium) {
                    // Если токен из URL, сохраняем его
                    if (urlToken) {
                        localStorage.setItem("token", urlToken);
                    }
                    setToken(token);

                    window.onSpotifyWebPlaybackSDKReady = () => {
                        initializePlayer(token);
                    };

                    const script = document.createElement("script");
                    script.src = "https://sdk.scdn.co/spotify-player.js";
                    script.async = true;

                    document.body.appendChild(script);

                    return () => {
                        document.body.removeChild(script);
                    };
                } else {
                    console.log("Premium account required or token expired");
                    // Если аккаунт не премиум или токен истек, удаляем токен и предлагаем войти снова
                    localStorage.removeItem("token");
                    setToken(null);
                }
            } else {
                console.log("No token available");
            }
        };

        initializeSDK();
    }, [initializePlayer, checkUserAccount]);

    const playTrack = useCallback(async (spotify_uri: string) => {
        if (!token || !deviceId) {
            toast({
                title: "Cannot play track",
                description: "Missing token or device ID",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotify_uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIsPlaying(true);
            toast({
                title: "Playback started",
                description: "The track is now playing",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error playing track:', error);
            toast({
                title: "Playback error",
                description: "Failed to start playback",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [token, deviceId, toast]);

    const searchAndPlayTrack = useCallback(async () => {
        if (!token) {
            console.log("No token available");
            return;
        }

        const searchParams = new URLSearchParams({
            q: `${songName} ${artist}`,
            type: 'track',
            limit: '1'
        });

        console.log("Searching for track:", searchParams.toString());

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Search response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Search results:", data);

            if (data.tracks.items.length > 0) {
                const trackUri = data.tracks.items[0].uri;
                console.log("Found track URI:", trackUri);
                await playTrack(trackUri);
            } else {
                console.log("No track found");
                toast({
                    title: "Track not found",
                    description: "Unable to find the specified track",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error searching for track:', error);
            toast({
                title: "Search error",
                description: "Failed to search for the track",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [token, songName, artist, playTrack, toast]);

    const handlePlayPause = useCallback(() => {
        if (!player) return;

        if (isPlaying) {
            player.pause();
            setIsPlaying(false);
        } else if (trackUri) {
            playTrack(trackUri);
        } else {
            searchAndPlayTrack();
        }
    }, [isPlaying, player, trackUri, playTrack, searchAndPlayTrack]);

    const handleStop = useCallback(() => {
        if (!player) return;
        player.pause();
        player.seek(0);
        setIsPlaying(false);
    }, [player]);

    if (!token) {
        return <Button onClick={login}>Login to Spotify</Button>;
    }

    return (
        <Box p={4}>
            If you have Premium Spotify account, you can listen to
            <HStack spacing={4}>
                <IconButton
                    icon={isPlaying ? <CiPause1 /> : <CiPlay1 />}
                    aria-label={isPlaying ? "pause" : "play"}
                    onClick={handlePlayPause}
                />
                <IconButton
                    icon={<CiStop1 />}
                    aria-label="stop"
                    onClick={handleStop}
                />
            </HStack>
        </Box>
    );
};

export default PlayerSpoty;