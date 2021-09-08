import { Router } from 'express';

// import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import AvatarController from './app/controllers/AvatarController';
import ContactController from './app/controllers/ContactController';
import ItemsController from './app/controllers/ItemsController';


import authMiddleware from './app/middlewares/auth';

// const upload = multer({ dest: 'uploads/file/' });

const routes = new Router();

routes.get('/', (req, res) => {
  return res.send('Welcome to Agenda.')
});
routes.post('/session', SessionController.store);
routes.post('/user', UserController.store);

routes.use(authMiddleware);

routes.get('/user/:user_type', UserController.index);
routes.put('/user', UserController.update);

routes.post('/file', FileController.store);
routes.post('/avatar', AvatarController.store);
routes.post('/avatar/contact', AvatarController.storeContact);
routes.post('/contact', ContactController.store);
routes.put('/contact', ContactController.update);
routes.get('/contact/search', ContactController.search);
routes.get('/contact/:user_id', ContactController.index);
routes.post('/contact/delete', ContactController.delete);
routes.get('/contact/details/:id', ContactController.get);
routes.post('/items', ItemsController.store);
routes.post('/items/delete', ItemsController.delete);
routes.put('/items', ItemsController.update);

export default routes;
