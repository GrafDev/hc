import { SimilarityMetric, SongSimilarity, SpotifySong } from "../../../entities/song/model/types";

// Нормализация числового значения в диапазоне [0, 1]
function normalize(value: number, min: number, max: number): number {
    return (max - min === 0) ? 0 : (value - min) / (max - min);
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

// Коэффициент Жаккара
function jaccardSimilarity(a: SpotifySong, b: SpotifySong): number {
    const setA = new Set([a.track_name, a.artist_name, a.key.toString(), a.mode.toString()]);
    const setB = new Set([b.track_name, b.artist_name, b.key.toString(), b.mode.toString()]);

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

// Расстояние Левенштейна
function levenshteinDistance(a: string, b: string): number {
    // Проверка на null или undefined
    if (a == null || b == null) {
        return 0; // или другое значение по умолчанию
    }

    a = a.toString(); // Преобразование в строку, если это не строка
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


// Преобразование расстояния Левенштейна в меру сходства
function levenshteinSimilarity(a: SpotifySong, b: SpotifySong): number {
    // Проверка на null или undefined
    if (!a || !b || !a.track_name || !b.track_name) {
        return 0; // или другое значение по умолчанию
    }

    const distance = levenshteinDistance(a.track_name, b.track_name);
    const maxLength = Math.max(a.track_name.length, b.track_name.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// Получение числовых характеристик песни
function getSongFeatures(song: SpotifySong): number[] {
    return [
        song.artist_count,
        song.released_year,
        song.released_month,
        song.released_day,
        song.in_spotify_playlists,
        song.in_spotify_charts,
        song.streams,
        song.danceability,
        song.energy,
        song.key,
        song.loudness,
        song.mode,
        song.speechiness,
        song.acousticness,
        song.instrumentalness,
        song.liveness,
        song.valence,
        song.tempo,
        song.duration_ms
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
                    similarityValue = 0; // или другое значение по умолчанию
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