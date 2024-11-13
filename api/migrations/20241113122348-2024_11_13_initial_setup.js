'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      house: {
        type: Sequelize.STRING(50),
      },
      housing: {
        type: Sequelize.STRING(50),
      },
      flat: {
        type: Sequelize.STRING(50),
      },
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
      comment: {
        type: Sequelize.TEXT,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: { model: 'department', key: 'id' },
        onDelete: 'RESTRICT',
      },
      organisation_id: {
        type: Sequelize.INTEGER,
        references: { model: 'organisation', key: 'id' },
        onDelete: 'RESTRICT',
      },
    });

    // Таблица employee
    await queryInterface.createTable('employee', {
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
      second_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      date_birth: {
        type: Sequelize.DATEONLY,
      },
      passport_id: {
        type: Sequelize.INTEGER,
        references: { model: 'passport', key: 'id' },
        onDelete: 'RESTRICT',
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: { model: 'address', key: 'id' },
        onDelete: 'RESTRICT',
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: { model: 'position', key: 'id' },
        onDelete: 'RESTRICT',
      },
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
      link: {
        type: Sequelize.TEXT,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: { model: 'employee', key: 'id' },
        onDelete: 'RESTRICT',
      },
    });

    // Таблица history_of_changes
    await queryInterface.createTable('history_of_changes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      object: {
        type: Sequelize.STRING(255),
      },
      field: {
        type: Sequelize.JSON,
      },
      date: {
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'user', key: 'id' },
        onDelete: 'RESTRICT',
      },
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
      date: {
        type: Sequelize.DATEONLY,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: { model: 'employee', key: 'id' },
        onDelete: 'RESTRICT',
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: { model: 'department', key: 'id' },
        onDelete: 'RESTRICT',
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: { model: 'position', key: 'id' },
        onDelete: 'RESTRICT',
      },
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
      comment: {
        type: Sequelize.TEXT,
      },
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
      code: {
        type: Sequelize.STRING(10),
      },
      issued_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
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
      second_name: {
        type: Sequelize.STRING(100),
      },
      login: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(50),
      },
    });
  },

  async down(queryInterface) {
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
