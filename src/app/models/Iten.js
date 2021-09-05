import Sequelize, { Model } from 'sequelize';

class Iten extends Model {
  static init(sequelize) {
    super.init(
      {
        contact_type: Sequelize.INTEGER,
        value: Sequelize.STRING,
        contact_id: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        canceled_by: Sequelize.INTEGER,
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

export default Iten;
