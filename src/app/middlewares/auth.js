import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // const { origin } = req.headers;

  // console.log(req.headers);

  // if (
  //   origin !== 'http://localhost:3333' &&
  //   origin !== 'http://localhost:3000' &&
  //   origin !== 'https://amazing-keller-5f8963.netlify.com'
  // ) {
  //   return next();
  // }

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // console.log('grupo de usuario', decoded);

    req.userId = decoded.id;
    req.userGroup = decoded.group;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Token invalid.', messages: err.inner });
  }
};
