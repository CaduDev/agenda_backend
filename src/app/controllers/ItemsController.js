import * as Yup from 'yup';
import Iten from '../models/Iten';

class ItemsController {
  async store(req, res) {
    const listPromisses = []

    req.body.map(item => {
      listPromisses.push(
        Iten.create(item)
      );    
    })

    const response = await Promise.all(listPromisses);

    return res.json(response);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, user_id, ...rest } = req.body;

    let items = await Iten.findOne({ where: { id } });

    await items.update({
      canceled_at: new Date(),
      canceled_by: user_id
    })

    items = await Iten.findOne({ where: { id } });

    return res.json(items);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      contact_type: Yup.number().required(),
      value: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, ...rest } = req.body;

    const items = await Iten.findOne({ where: { id } });

    await items.update(rest)

    const newItems = await Iten.findOne({ where: { id } });

    return res.json(newItems);
  }
}

export default new ItemsController();
