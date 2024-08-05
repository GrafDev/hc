import FileService from '../services/file-service.js';

class FileControllers {
  async readFile(req, res) {
    try {
      const filename = 'Most Streamed Spotify Songs 2024.csv';
      const fileContent = await FileService.readFile(filename);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(fileContent);
    } catch (error) {
      console.error('Error in readFile controller:', error);
      res.status(500).json({ message: 'Error reading file', error: error.message });
    }
  }

  async readShortFile(req, res) {
    try {
      const filename = 'Most Streamed Spotify Songs 2024-short.csv';
      const fileContent = await FileService.readFile(filename);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(fileContent);
    } catch (error) {
      console.error('Error in readShortFile controller:', error);
      res.status(500).json({ message: 'Error reading file', error: error.message });
    }
  }
}

export default new FileControllers();