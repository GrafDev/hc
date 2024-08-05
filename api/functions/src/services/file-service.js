import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

class FileService {
  async readFile(filename) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = path.join(__dirname, '..', 'data', filename);

      // Проверяем существование файла
      await fs.access(filePath);

      const fileContent = await fs.readFile(filePath, 'utf-8');
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error(`Error reading file: ${error.message}`);
    }
  }
}

export default new FileService();