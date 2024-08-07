import JsonService from '../services/json-service.js';

class JsonControllers {
  async readJson(req, res) {
    try {
      const filename = 'Most Streamed Spotify Songs 2024.csv';

      // Получаем quantity из параметров маршрута
      const quantity = parseInt(req.params.quantity);

      // Проверка на валидность quantity
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity parameter' });
      }

      const jsonString = await JsonService.getJson(filename, quantity);
      res.setHeader('Content-Type', 'application/json');
      res.send(jsonString);
    } catch (error) {
      console.error('Error in readJson controller:', error);
      res.status(500).json({ message: 'Error reading file', error: error.message });
    }
  }
}

export default new JsonControllers();