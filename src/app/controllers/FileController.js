import File from '../models/File';

class FileController {
  async store(req, res) {
    const file = await File.create(req.body);

    return res.json(file);
  }
}

export default new FileController();
