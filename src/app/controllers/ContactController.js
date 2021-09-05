import * as Yup from 'yup';
import base64ToImage from 'base64-to-image'
import Sequelize from 'sequelize';
const { Op } = Sequelize;

import Contact from '../models/Contact';
import File from '../models/File';
import Iten from '../models/Iten';

class ContactController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const createContact = await Contact.create(req.body)

    const {
      id,
    } = createContact;

    const { avatar } = req.body;

    const base64 = avatar;

    if(base64) {
      const path = './src/uploads/file/';
  
      const imageInfo = base64ToImage(base64, path);
  
      const nameImage = imageInfo.fileName;
  
      const file = await File.create({
        file_type: 1,
        name: 'teste.jpg',
        path: nameImage,
        created_at: new Date(),
        created_by: id,
      });
  
      const { id: file_id } = file;

      const contact = await Contact.findByPk(id);

      await contact.update({ file_id });
    }


    const contact = await Contact.findByPk(parseInt(id),{ 
      where: { canceled_at: null },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        },
        {
          model: Iten,
          as: 'contact_list',
          required: false,
          where: { canceled_by: null },
          attributes: [
            'id',
            'contact_type',
            'value',
          ],
        },
      ]
    });

    return res.json(contact)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, ...rest } = req.body;

    const contact = await Contact.findOne({ where: { id } });

    await contact.update(rest)

    const newContact = await Contact.findOne({ 
      where: { id },
      include: [
        {
          
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        }
      ]
    });

    return res.json(newContact)
  }

  async index(req, res) {
    const { user_id } = req.params;

    const contact = await Contact.findAll({ 
      where: { user_id, canceled_by: null, canceled_at: null },
      attributes: [
        'id',
        'user_id',
        'name',
        'surname',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        },
        {
          model: Iten,
          as: 'contact_list',
          required: false,
          where: { canceled_by: null },
          attributes: [
            'id',
            'contact_type',
            'value',
          ],
        },
      ]
    });

    return res.json(contact)
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

    const contact = await Contact.findOne({ where: { id } });

    await contact.update({
      canceled_at: new Date(),
      canceled_by: user_id
    })

    const newContact = await Contact.findOne({ 
      where: { id },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        }
      ]
    });

    return res.json(newContact)
  }

  async get(req, res) {
    const { id } = req.params;
    const contact = await Contact.findByPk(parseInt(id),{ 
      where: { canceled_at: null },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        },
        {
          model: Iten,
          as: 'contact_list',
          required: false,
          where: { canceled_by: null },
          attributes: [
            'id',
            'contact_type',
            'value',
          ],
        },
      ]
    });

    return res.json(contact)
  }

  async search(req, res) {
    const { name, user_id } = req.query;

    if (!name) {
      const response = await Contact.findAll({ 
        where: { user_id, canceled_by: null, canceled_at: null },
        attributes: [
          'id',
          'user_id',
          'name',
          'surname',
        ],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: [
              'file_type',
              'user_id',
              'name',
              'path',
              'canceled_at',
              'url',
              'thumbnail',
            ],
          },
          {
            model: Iten,
            as: 'contact_list',
            required: false,
            where: { canceled_by: null },
            attributes: [
              'id',
              'contact_type',
              'value',
            ],
          },
        ]
      });
  
      return res.json(response);
    }

    const response = await Contact.findAll({ 
      where: {
        [Op.or]: [
          {
            name: {
              [Op.startsWith]: req.query.name,
            },
          },
          {
            surname: {
              [Op.startsWith]: req.query.name,
            },
          },
        ],
        canceled_at: null,
      },      
      attributes: [
        'id',
        'user_id',
        'name',
        'surname',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [
            'file_type',
            'user_id',
            'name',
            'path',
            'canceled_at',
            'url',
            'thumbnail',
          ],
        },
        {
          model: Iten,
          as: 'contact_list',
          required: false,
          where: { canceled_by: null },
          attributes: [
            'id',
            'contact_type',
            'value',
          ],
        },
      ]
    });

    return res.json(response);
  }
}

export default new ContactController();
