import { SimilarityMetric, SongSimilarity, SpotifySong } from "../../../entities/song/model/types";
import { SHA256 } from 'crypto-js';

function normalize(value: number, min: number, max: number): number {
    return (max - min === 0) ? 0 : (value - min) / (max - min);
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

function euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, _, i) => sum + Math.pow(a[i] - b[i], 2), 0));
}

function euclideanSimilarity(a: number[], b: number[]): number {
    const distance = euclideanDistance(a, b);
    return 1 / (1 + distance);
}

function jaccardSimilarity(a: SpotifySong, b: SpotifySong): number {
    const setA = new Set([a.Track, a.Artist, a.Release_Date]);
    const setB = new Set([b.Track, b.Artist, b.Release_Date]);

    let intersectionSize = 0;
    let unionSize = 0;

    setA.forEach(item => {
        if (setB.has(item)) {
            intersectionSize++;
        }
        unionSize++;
    });

    setB.forEach(item => {
        if (!setA.has(item)) {
            unionSize++;
        }
    });

    return intersectionSize / unionSize;
}

function levenshteinDistance(a: string, b: string): number {
    if (a == null || b == null) {
        return 0;
    }

    a = a.toString();
    b = b.toString();

    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function levenshteinSimilarity(a: SpotifySong, b: SpotifySong): number {
    if (!a || !b || !a.Track || !b.Track) {
        return 0;
    }

    const distance = levenshteinDistance(a.Track, b.Track);
    const maxLength = Math.max(a.Track.length, b.Track.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

function getSongFeatures(song: SpotifySong): number[] {
    return [
        song.All_Time_Rank,
        song.Track_Score,
        song.Spotify_Streams,
        song.Spotify_Playlist_Count,
        song.Spotify_Playlist_Reach,
        song.Spotify_Popularity,
        song.YouTube_Views,
        song.YouTube_Likes,
        song.TikTok_Posts,
        song.TikTok_Likes,
        song.TikTok_Views,
        song.YouTube_Playlist_Reach,
        song.Apple_Music_Playlist_Count,
        song.AirPlay_Spins,
        song.SiriusXM_Spins,
        song.Deezer_Playlist_Count,
        song.Deezer_Playlist_Reach,
        song.Amazon_Playlist_Count,
        song.Pandora_Streams,
        song.Pandora_Track_Stations,
        song.Soundcloud_Streams,
        song.Shazam_Counts,
        song.TIDAL_Popularity,
        song.Explicit_Track
    ];
}

function normalizeSongFeatures(songs: SpotifySong[]): number[][] {
    const features = songs.map(getSongFeatures);
    const numFeatures = features[0].length;
    const normalizedFeatures: number[][] = [];

    for (let i = 0; i < numFeatures; i++) {
        const featureValues = features.map(f => f[i]);
        const min = Math.min(...featureValues);
        const max = Math.max(...featureValues);
        const normalizedFeature = featureValues.map(v => normalize(v, min, max));
        normalizedFeatures.push(normalizedFeature);
    }

    return normalizedFeatures[0].map((_, i) => normalizedFeatures.map(f => f[i]));
}

export function calculateSimilarity(songs: SpotifySong[], metric: SimilarityMetric, topN: number = 5): SongSimilarity {
    // Создаем хеш-сумму для songs
    const songsHash = SHA256(JSON.stringify(songs)).toString();

    // Создаем ключи для localStorage
    const hashKey = `songs_hash_${metric}_${topN}`;
    const similarityKey = `similarity_${metric}_${topN}`;

    // Получаем сохраненный хеш и результат
    const storedHash = localStorage.getItem(hashKey);
    const storedResult = localStorage.getItem(similarityKey);

    // Проверяем, совпадает ли текущий хеш с сохраненным
    if (storedHash === songsHash && storedResult) {
        // Если хеши совпадают и результат есть, возвращаем сохраненный результат
        return JSON.parse(storedResult);
    }

    // Если хеши не совпадают или результата нет, выполняем расчет
    const normalizedFeatures = normalizeSongFeatures(songs);
    const similarity: SongSimilarity = {};

    for (let i = 0; i < songs.length; i++) {
        const similarities: { track: string; value: number }[] = [];
        for (let j = 0; j < songs.length; j++) {
            if (i !== j) {
                let similarityValue: number;
                try {
                    switch (metric) {
                        case 'cosine':
                            similarityValue = cosineSimilarity(normalizedFeatures[i], normalizedFeatures[j]);
                            break;
                        case 'euclidean':
                            similarityValue = euclideanSimilarity(normalizedFeatures[i], normalizedFeatures[j]);
                            break;
                        case 'jaccard':
                            similarityValue = jaccardSimilarity(songs[i], songs[j]);
                            break;
                        case 'levenshtein':
                            similarityValue = levenshteinSimilarity(songs[i], songs[j]);
                            break;
                        default:
                            throw new Error(`Unsupported similarity metric: ${metric}`);
                    }
                } catch (error) {
                    console.error(`Error calculating similarity for songs ${i} and ${j}:`, error);
                    similarityValue = 0;
                }
                similarities.push({ track: songs[j].Track, value: similarityValue });
            }
        }
        similarities.sort((a, b) => b.value - a.value);
        similarity[songs[i].Track] = Object.fromEntries(
            similarities.slice(0, topN).map(s => [s.track, s.value])
        );
    }

    // Сохраняем новый хеш и результат в localStorage
    localStorage.setItem(hashKey, songsHash);
    localStorage.setItem(similarityKey, JSON.stringify(similarity));

    return similarity;
}

export function findSimilarSongs(song: SpotifySong, songs: SpotifySong[], similarity: SongSimilarity, limit: number = 5): SpotifySong[] {
    const songSimilarities = similarity[song.Track];
    if (!songSimilarities) return [];
    const sortedSimilarities = Object.entries(songSimilarities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

    return sortedSimilarities.map(([track]) => songs.find(s => s.Track === track)!)
        .filter(Boolean);
}