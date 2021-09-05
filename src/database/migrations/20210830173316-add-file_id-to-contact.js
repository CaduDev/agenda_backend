module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('contacts', 'file_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('contacts', 'file_id');
  },
};
