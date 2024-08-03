import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

class FileService {
  async readFile(filename) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = path.join(__dirname, '..', 'data', filename);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return fileContent;
    } catch (error) {
      console.error(error);
      throw new Error('Error reading file');
    }
  }
}

export default new FileService();
