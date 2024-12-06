'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Таблица address
    await queryInterface.createTable('address', {
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
    });

    // Таблица department
    await queryInterface.createTable('department', {
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
    });

    // Таблица employee
    await queryInterface.createTable('employee', {
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
    });

    // Таблица file
    await queryInterface.createTable('file', {
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
    });

    // Таблица history_of_changes
    await queryInterface.createTable('history_of_changes', {
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
    });

    // Таблица hr_action
    await queryInterface.createTable('hr_action', {
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
    });

    // Таблица organisation
    await queryInterface.createTable('organisation', {
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
    });

    // Таблица passport
    await queryInterface.createTable('passport', {
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
    });

    // Таблица position
    await queryInterface.createTable('position', {
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
    });

    // Таблица user
    await queryInterface.createTable('user', {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('position');
    await queryInterface.dropTable('passport');
    await queryInterface.dropTable('organisation');
    await queryInterface.dropTable('hr_action');
    await queryInterface.dropTable('history_of_changes');
    await queryInterface.dropTable('file');
    await queryInterface.dropTable('employee');
    await queryInterface.dropTable('department');
    await queryInterface.dropTable('address');
  },
};
