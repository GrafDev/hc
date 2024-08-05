import FileService from '../services/file-service.js';
import { FILENAME_SPOTIFY, FILENAME_SPOTIFY_SHORT } from '../entities/constants.js'

class FileControllers {
  async readFile(req, res) {
    try {
      const results = await FileService.readFile(FILENAME_SPOTIFY);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error reading or parsing CSV file', error: error.message });
    }
  }
  async readShortFile(req, res) {
    try {
      const results = await FileService.readFile(FILENAME_SPOTIFY_SHORT);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error reading or parsing short_CSV file', error: error.message });
    }
  }
}

export default new FileControllers();