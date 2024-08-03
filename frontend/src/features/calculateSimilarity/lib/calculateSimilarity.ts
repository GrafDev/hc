

// Нормализация числового значения в диапазоне [0, 1]

import {SimilarityMetric, SongSimilarity, SpotifySong} from "../../../entities/song/model/types";

function normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

// Косинусное сходство
function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Евклидово расстояние
function euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, _, i) => sum + Math.pow(a[i] - b[i], 2), 0));
}

// Преобразование евклидова расстояния в меру сходства
function euclideanSimilarity(a: number[], b: number[]): number {
    const distance = euclideanDistance(a, b);
    return 1 / (1 + distance);
}

// Получение числовых характеристик песни
function getSongFeatures(song: SpotifySong): number[] {
    return [
        song.danceability,
        song.energy,
        song.loudness,
        song.speechiness,
        song.acousticness,
        song.instrumentalness,
        song.liveness,
        song.valence,
        song.tempo,
    ];
}

// Нормализация характеристик песен
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

export function calculateSimilarity(songs: SpotifySong[], metric: SimilarityMetric): SongSimilarity {
    const normalizedFeatures = normalizeSongFeatures(songs);
    const similarity: SongSimilarity = {};
    for (let i = 0; i < songs.length; i++) {
        similarity[songs[i].spotify_url] = {};
        for (let j = 0; j < songs.length; j++) {
            if (i !== j) {
                let similarityValue: number;
                switch (metric) {
                    case 'cosine':
                        similarityValue = cosineSimilarity(normalizedFeatures[i], normalizedFeatures[j]);
                        break;
                    case 'euclidean':
                        similarityValue = euclideanSimilarity(normalizedFeatures[i], normalizedFeatures[j]);
                        break;
                    default:
                        throw new Error(`Unsupported similarity metric: ${metric}`);
                }
                similarity[songs[i].spotify_url][songs[j].spotify_url] = similarityValue;
            }
        }
    }

    return similarity;
}

export function findSimilarSongs(song: SpotifySong, songs: SpotifySong[], similarity: SongSimilarity, limit: number = 5): SpotifySong[] {
    const songSimilarities = similarity[song.spotify_url];
    if (!songSimilarities) return [];
    const sortedSimilarities = Object.entries(songSimilarities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

    return sortedSimilarities.map(([url]) => songs.find(s => s.spotify_url === url)!)
        .filter(Boolean);
}