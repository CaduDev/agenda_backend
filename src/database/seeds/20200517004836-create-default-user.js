module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          user_type: 1,
          fullname: 'Carlos Eduardo',
          name: 'Carlos',
          surname: 'Eduardo',
          genre: 'masculino',
          email: 'admin@admin.com',
          password_hash:
            '$2a$08$tAgp6aStV.V3StvfldCQTemP3nNNUrzWzPirG.CjzpXg9ExOMdwwa',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
