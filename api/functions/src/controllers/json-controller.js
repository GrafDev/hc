
import JsonService from '../services/json-service.js';

class JsonControllers {
  async readJson(req, res) {
    try {
      const filename = 'Most Streamed Spotify Songs 2024.csv'; // Change extension to .json
      const jsonString = await JsonService.getJson(filename);
      res.setHeader('Content-Type', 'application/json'); // Set correct content type for JSON
      res.send(jsonString);
    } catch (error) {
      console.error('Error in readFile controller:', error);
      res.status(500).json({ message: 'Error reading file', error: error.message });
    }
  }
}


export default new JsonControllers();