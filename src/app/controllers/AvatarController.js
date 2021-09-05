import * as Yup from 'yup';

import base64ToImage from 'base64-to-image';

import File from '../models/File';
import User from '../models/User';
import Contact from '../models/Contact';

class AvatarController {
  async store(req, res) {
    const schema = Yup.object().shape({
      file_type: Yup.number().required(),
      user_id: Yup.number().required(),
      name: Yup.string().required(),
      base64: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { file_type, user_id, name, base64 } = req.body;

    const path = './src/uploads/file/';

    const imageInfo = base64ToImage(base64, path);

    const nameImage = imageInfo.fileName;

    const file = await File.create({
      file_type,
      user_id,
      name,
      path: nameImage,
      created_at: new Date(),
      created_by: user_id,
    });

    const { id } = file;

    const user = await User.findByPk(user_id);

    await user.update({ avatar_id: id });

    const user_profile = await User.findOne({
      where: { id: user_id },
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
      ],
    });

    const { avatar } = user_profile;

    return res.json(avatar);
  }

  async storeContact(req, res) {
    const schema = Yup.object().shape({
      file_type: Yup.number().required(),
      id_contact: Yup.number().required(),
      user_id: Yup.number().required(),
      name: Yup.string().required(),
      base64: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { file_type, id_contact, user_id, name, base64 } = req.body;

    const path = './src/uploads/file/';

    const imageInfo = base64ToImage(base64, path);

    const nameImage = imageInfo.fileName;

    const file = await File.create({
      file_type,
      name,
      path: nameImage,
      created_at: new Date(),
      created_by: user_id,
    });

    const { id } = file;

    console.log('id_contactid_contactid_contactid_contactid_contactid_contactid_contact', id_contact)

    const contact = await Contact.findByPk(id_contact);

    await contact.update({ file_id: id });

    const newContact = await Contact.findOne({ 
      where: { id: id_contact },
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

    const { avatar } = newContact;

    return res.json(avatar);
  }
}

export default new AvatarController();
