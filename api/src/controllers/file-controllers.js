import FileService from '../services/file-service.js';
import { FILENAME_SPOTIFY } from '../entities/constants.js';

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
}

export default new FileControllers();