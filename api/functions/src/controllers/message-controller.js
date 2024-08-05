import MessageService from '../services/message-service.js'

class MessageControllers {
  async getServiceOk(req, res) {
    try {
      const results = await MessageService.getOk();
      res.json("Controller OK, " + results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error reading or parsing CSV file', error: error.message });
    }
  }
}

export default new MessageControllers();