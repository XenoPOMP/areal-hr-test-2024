module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction(); // создаем транзакцию
    try {
      // Таблица address
      await queryInterface.createTable(
        'address',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          region: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          settlement: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          street: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          house: Sequelize.STRING(50),
          housing: Sequelize.STRING(50),
          flat: Sequelize.STRING(50),
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица department
      await queryInterface.createTable(
        'department',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          comment: Sequelize.TEXT,
          parent_id: Sequelize.INTEGER,
          organisation_id: Sequelize.INTEGER,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица employee
      await queryInterface.createTable(
        'employee',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          surname: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          second_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          date_birth: Sequelize.DATEONLY,
          position_id: Sequelize.INTEGER,
          passport_id: Sequelize.INTEGER,
          address_id: Sequelize.INTEGER,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица file
      await queryInterface.createTable(
        'file',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          link: Sequelize.TEXT,
          employee_id: Sequelize.INTEGER,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица history_of_changes
      await queryInterface.createTable(
        'history_of_changes',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          object: Sequelize.STRING(255),
          field: Sequelize.JSON,
          date: Sequelize.DATE,
          user_id: Sequelize.INTEGER,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица hr_action
      await queryInterface.createTable(
        'hr_action',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          action_type: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          date: Sequelize.DATEONLY,
          employee_id: Sequelize.INTEGER,
          department_id: Sequelize.INTEGER,
          position_id: Sequelize.INTEGER,
          salary: Sequelize.INTEGER,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица organisation
      await queryInterface.createTable(
        'organisation',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          comment: Sequelize.TEXT,
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица passport
      await queryInterface.createTable(
        'passport',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          serial: {
            type: Sequelize.STRING(10),
            allowNull: false,
          },
          number: {
            type: Sequelize.STRING(10),
            allowNull: false,
          },
          date_issue: {
            type: Sequelize.DATEONLY,
            allowNull: false,
          },
          code: Sequelize.STRING(10),
          issued_by: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица position
      await queryInterface.createTable(
        'position',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Таблица user
      await queryInterface.createTable(
        'user',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          surname: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          second_name: Sequelize.STRING(100),
          login: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          role: Sequelize.STRING(50),
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      await transaction.commit(); // фиксируем изменения
    } catch (error) {
      await transaction.rollback(); // откатываем изменения в случае ошибки
      throw error; // выбрасываем ошибку для обработки
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('user', { transaction });
      await queryInterface.dropTable('position', { transaction });
      await queryInterface.dropTable('passport', { transaction });
      await queryInterface.dropTable('organisation', { transaction });
      await queryInterface.dropTable('hr_action', { transaction });
      await queryInterface.dropTable('history_of_changes', { transaction });
      await queryInterface.dropTable('file', { transaction });
      await queryInterface.dropTable('employee', { transaction });
      await queryInterface.dropTable('department', { transaction });
      await queryInterface.dropTable('address', { transaction });

      await transaction.commit(); // фиксируем изменения
    } catch (error) {
      await transaction.rollback(); // откатываем изменения в случае ошибки
      throw error; // выбрасываем ошибку для обработки
    }
  },
};
