
class MessageService {
  async getOk() {
    try {
      return "Service message OK";
    } catch (error) {
      console.error(error);
      throw new Error('Error reading file');
    }
  }
}

export default new MessageService();
