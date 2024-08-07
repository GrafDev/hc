import Papa from "papaparse";

export function parseCSV2Array(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: false,
      complete: (results) => {
        let songs = results.data.map((row) => {
          const parseNumber = (value) => {
            if (value === undefined || value === null || value === '') {
              return 0;
            }
            const parsed = Number(value.replace(/,/g, ''));
            return isNaN(parsed) ? 0 : parsed;
          };

          return {
            Track: row.Track || '',
            Album_Name: row['Album Name'] || '',
            Artist: row.Artist || '',
            Release_Date: row['Release Date'] || '',
            ISRC: row.ISRC || '',
            All_Time_Rank: parseNumber(row['All Time Rank']),
            Track_Score: parseNumber(row['Track Score']),
            Spotify_Streams: parseNumber(row['Spotify Streams']),
            Spotify_Playlist_Count: parseNumber(row['Spotify Playlist Count']),
            Spotify_Playlist_Reach: parseNumber(row['Spotify Playlist Reach']),
            Spotify_Popularity: parseNumber(row['Spotify Popularity']),
            YouTube_Views: parseNumber(row['YouTube Views']),
            YouTube_Likes: parseNumber(row['YouTube Likes']),
            TikTok_Posts: parseNumber(row['TikTok Posts']),
            TikTok_Likes: parseNumber(row['TikTok Likes']),
            TikTok_Views: parseNumber(row['TikTok Views']),
            YouTube_Playlist_Reach: parseNumber(row['YouTube Playlist Reach']),
            Apple_Music_Playlist_Count: parseNumber(row['Apple Music Playlist Count']),
            AirPlay_Spins: parseNumber(row['AirPlay Spins']),
            SiriusXM_Spins: parseNumber(row['SiriusXM Spins']),
            Deezer_Playlist_Count: parseNumber(row['Deezer Playlist Count']),
            Deezer_Playlist_Reach: parseNumber(row['Deezer Playlist Reach']),
            Amazon_Playlist_Count: parseNumber(row['Amazon Playlist Count']),
            Pandora_Streams: parseNumber(row['Pandora Streams']),
            Pandora_Track_Stations: parseNumber(row['Pandora Track Stations']),
            Soundcloud_Streams: parseNumber(row['Soundcloud Streams']),
            Shazam_Counts: parseNumber(row['Shazam Counts']),
            TIDAL_Popularity: parseNumber(row['TIDAL Popularity']),
            Explicit_Track: parseNumber(row['Explicit Track'])
          };
        });

        // Исключаем элементы, если поле Track в них равно undefined или ''
        songs = songs.filter((song) => song.Track !== undefined && song.Track !== '');

        resolve(songs);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}