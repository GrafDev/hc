import {SpotifySong} from "../../entities/song/model/types";
import * as Papa from 'papaparse';

async function fetchCSV(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
}

export function parseSpotifyCSV(csvText: string): Promise<SpotifySong[]> {
    // console.log("csvText",csvText)
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                const songs = results.data as SpotifySong[];
                // console.log(songs)
                resolve(songs);
            },
            error: (error: any) => {
                reject(error);
            },
        });
    });
}

export async function parseSpotifyCSVFromURL(url: string): Promise<SpotifySong[]> {
    try {
        const csvText = await fetchCSV(url);
        return await parseSpotifyCSV(csvText);
    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
        throw error;
    }
}