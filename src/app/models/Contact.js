import Sequelize, { Model } from 'sequelize';

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        surname: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        canceled_by: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        created_by: Sequelize.INTEGER,
        file_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'avatar' });
    this.hasMany(models.Iten, { foreignKey: 'contact_id', as: 'contact_list' });
  }
}

export default Contact;
