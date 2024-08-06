import {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import * as React from 'react';
import {SpotifySong, SongSimilarity, SimilarityMetric} from '../../entities/song/model/types';
import axios from "axios";
import {calculateSimilarity} from "../../features/calculateSimilarity/lib/calculateSimilarity.ts";

interface DataContextType {
    songs: SpotifySong[];
    _quantity: number;
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
    quantity: number;
}

export const DataProvider: React.FC<DataProviderProps> = ({children,quantity}) => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const [_quantity] = useState(quantity);
    const [similarities, setSimilarities] = useState<SongSimilarity>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const metric: SimilarityMetric = 'jaccard';
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Loading data from JSON");
                const apiUrl = `https://us-central1-hunter-corp-sa.cloudfunctions.net/api/json:${quantity}`;
                // Получение готового JSON
                const response = await axios.get(apiUrl);
                const data = response.data;

                console.log("Received JSON data");

                // Предполагаем, что JSON содержит поля songs и similarities
                setSongs(data);

                const calculatedSimilarities = calculateSimilarity(data, metric, 5);
                setSimilarities(calculatedSimilarities);

            } catch (err) {
                setError('Error loading data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{songs,_quantity, similarities, loading, error}}>
            {children}
        </DataContext.Provider>
    );
};