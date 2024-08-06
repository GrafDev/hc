import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'
import { parseCSV2Array } from '../features/csv-parser.js'

class JsonService {
  async getJson(filename) {
    try {
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const filePath = path.join(__dirname, '..', 'data', filename)

      // Проверяем существование файла
      await fs.access(filePath)

      // Читаем содержимое файла
      const fileContent = await fs.readFile(filePath, 'utf-8')

      // Парсим CSV в массив
      const songs = await parseCSV2Array(fileContent)

      // Преобразуем результат в JSON
      const jsonString = JSON.stringify(songs, null, 2)

      return jsonString
    } catch (error) {
      console.error('Error processing file:', error)
      throw new Error(`Error processing file: ${error.message}`)
    }
  }
}

export default new JsonService()