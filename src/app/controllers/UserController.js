import * as Yup from 'yup';

import { subHours } from 'date-fns';

import Sequelize from 'sequelize';

import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_type: Yup.number().required(),
      name: Yup.string().required(),
      genre: Yup.string().required(),
      email: Yup.string().email(),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const userExists_Email = await User.findOne({ where: { email } });

    if (userExists_Email) {
      return res
        .status(400)
        .json({ error: 'User already exists.', type: 'email' });
    }

    const userExists_Nickname = await User.findOne({ where: { nickname } });

    if (userExists_Nickname) {
      return res
        .status(400)
        .json({ error: 'User already exists.', type: nickname });
    }

    const createUser = await User.create({
      ...req.body,
      fullname: `${req.body.name} ${req.body.surname || ''}`,
    });

    const {
      id,
      user_type,
      fullname,
      name,
      surname,
      password,
    } = createUser;

    return res.json({
      id,
      user_type,
      fullname,
      name,
      surname,
      email,
      password,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      user_type: Yup.number().required(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, email, oldPassword } = req.body;

    const user = await User.findOne({ where: { id } });

    // return res.json(user);

    if (email && email !== user.email) {
      const userExists_Email = await User.findOne({ where: { email } });

      if (userExists_Email) {
        return res
          .status(400)
          .json({ error: 'User already exists.', type: 'email' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // return res.json(req.body);

    const { body } = req;

    const { birthday } = body;

    await user.update({
      ...body,
      birthday: new Date(subHours(new Date(birthday), 3)),
    });

    const users = await User.findOne({
      where: { email },
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
          model: File,
          as: 'cover',
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
          model: File,
          as: 'featured',
          where: {
            file_type: 5,
          },
          required: false,
          attributes: [
            'id',
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

    const {
      user_type,
      name,
      surname,
      nickname,
      status,
      level,
      avatar,
      cover,
      featured,
    } = users;

    return res.json({
      user: {
        id,
        user_type,
        name,
        surname,
        nickname,
        birthday,
        status,
        level,
        avatar,
        cover,
        featured,
      },
    });
  }

  async index(req, res) {
    const { user_type } = req.params;

    const users = await User.findAll({
      where: { user_type },
      attributes: [
        'user_type',
        'name',
        'fullname',
        'surname',
        'nickname',
        'birthday',
        'status',
        'level',
        'email',
        'canceled_at',
      ],
      required: false,
      include: [
        {
          model: File,
          as: 'avatar',
          where: {
            file_type: 1,
          },
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
          model: File,
          as: 'cover',
          where: {
            file_type: 2,
          },
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
          model: File,
          as: 'featured',
          where: {
            file_type: 5,
          },
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
          model: Elo,
          as: 'elo',
        },
      ],
    });

    return res.json(users);
  }
}

export default new UserController();
