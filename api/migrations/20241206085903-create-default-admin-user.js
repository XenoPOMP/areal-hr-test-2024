const argon2 = require('argon2');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Хэшируем пароль
    const hashedPassword = await argon2.hash('admin');

    // Вставляем пользователя admin
    await queryInterface.bulkInsert('user', [
      {
        name: 'Admin',
        surname: 'Admin',
        second_name: 'Admin',
        login: 'admin',
        password: hashedPassword,
        role: 'admin',
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Удаляем пользователя admin
    await queryInterface.bulkDelete('user', { login: 'admin' });
  },
};
