import express from 'express';

import cors from 'cors';

import bodyParser from 'body-parser';

import path from 'path';

import https from 'https';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();

    this.server = https.Server(this.app);

    this.middlerwares();

    this.routes();
  }

  middlerwares() {
    this.app.use(bodyParser.json({ limit: '50mb' }));

    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    this.app.use(express.json());

    this.app.use(cors());


    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, 'uploads', 'file'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
