import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        file_type: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.path
              ? `http://localhost:3333/files/${this.path}`
              : null;
          },
        },
        thumbnail: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.path
              ? `http://localhost:3333/thumbnail/${this.path}`
              : null;
          },
        },
        canceled_at: Sequelize.DATE,
        created_at: Sequelize.DATE,
        created_by: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
