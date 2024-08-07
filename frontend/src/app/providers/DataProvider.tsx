import {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import * as React from 'react';
import {SpotifySong, SongSimilarity, SimilarityMetric} from '../../entities/song/model/types';
import axios from "axios";
import {calculateSimilarity} from "../../features/calculateSimilarity/lib/calculateSimilarity.ts";

interface IDataContextType {
    songs: SpotifySong[];
    _quantity: number;
    similarities: SongSimilarity;
    loading: boolean;
    error: string | null;
}

const DataContext = createContext<IDataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

interface IDataProviderProps {
    children: ReactNode;
    quantity: number;
    isChooseQuantity: boolean
}

export const DataProvider: React.FC<IDataProviderProps> = ({children, quantity, isChooseQuantity}) => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const [_quantity] = useState(quantity);
    const [similarities, setSimilarities] = useState<SongSimilarity>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isChooseQuantity) {
        const metric: SimilarityMetric = 'jaccard';



            const fetchData = async () => {
                try {
                    setLoading(true);
                    console.log("Loading data from JSON");
                    const apiUrl = `https://us-central1-hunter-corp-sa.cloudfunctions.net/api/json:${_quantity}`;
                    const response = await axios.get(apiUrl);
                    const data = response.data;

                    console.log("Received JSON data", data);

                    if (!Array.isArray(data) || data.length === 0) {
                        throw new Error('Invalid or empty data received');
                    }

                    setSongs(data);

                    const calculatedSimilarities = calculateSimilarity(data, metric, 5);
                    setSimilarities(calculatedSimilarities);
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        setError(`Error loading data: ${err.message}`);
                    } else {
                        setError('An unexpected error occurred');
                    }
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [_quantity,isChooseQuantity]);

    return (
        <DataContext.Provider value={{songs, _quantity, similarities, loading, error}}>
            {children}
        </DataContext.Provider>
    );
};