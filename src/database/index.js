import Sequelize from 'sequelize';

import User from '../app/models/User';
import Contact from '../app/models/Contact';
import File from '../app/models/File';
import Iten from '../app/models/Iten';

import databaseConfig from '../config/database';

const models = [User, Contact, File, Iten];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
