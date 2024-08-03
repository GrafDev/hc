import  { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as React from 'react';
import { SpotifySong, SongSimilarity } from '../../entities/song/model/types';
import { parseSpotifyCSV } from '../../shared/lib/csvParser';
import { calculateSimilarity } from '../../features/calculateSimilarity/lib/calculateSimilarity';
import axios from 'axios';

interface DataContextType {
    songs: SpotifySong[];
    similarities: SongSimilarity;
    loading: boolean;
    error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const [similarities, setSimilarities] = useState<SongSimilarity>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Получение CSV данных с сервера
                const response = await axios.get('http://localhost:5512/file');
                const csvText = response.data;

                // Парсинг CSV
                const parsedSongs = await parseSpotifyCSV(csvText);
                setSongs(parsedSongs);

                // Расчет сходства
                const calculatedSimilarities = calculateSimilarity(parsedSongs, 'cosine');
                setSimilarities(calculatedSimilarities);
            } catch (err) {
                setError('Error loading or processing data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ songs, similarities, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};