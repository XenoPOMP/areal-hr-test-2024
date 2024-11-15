'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organisation', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
      },
    });

    await queryInterface.createTable('department', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        references: {
          model: 'department',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
      organisation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organisation',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
    });

    await queryInterface.createTable('position', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    await queryInterface.createTable('address', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      region: Sequelize.STRING(255),
      settlement: Sequelize.STRING(255),
      street: Sequelize.STRING(255),
      house: Sequelize.STRING(50),
      housing: Sequelize.STRING(50),
      flat: Sequelize.STRING(50),
    });

    await queryInterface.createTable('passport', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serial: Sequelize.STRING(10),
      number: Sequelize.STRING(10),
      date_issue: Sequelize.DATE,
      code: Sequelize.STRING(10),
      issued_by: Sequelize.STRING(255),
    });

    await queryInterface.createTable('employee', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING(100),
      surname: Sequelize.STRING(100),
      second_name: Sequelize.STRING(100),
      date_birth: Sequelize.DATE,
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'position',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
      },
    });

    await queryInterface.createTable('file', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING(255),
      link: Sequelize.TEXT,
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
    });

    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING(100),
      surname: Sequelize.STRING(100),
      second_name: Sequelize.STRING(100),
      login: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      password: Sequelize.STRING(255),
      role: Sequelize.STRING(50),
    });

    await queryInterface.createTable('history_of_changes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      object: Sequelize.STRING(255),
      field: Sequelize.JSON,
      date: Sequelize.DATE,
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
    });

    await queryInterface.createTable('hr_action', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      action_type: Sequelize.STRING(50),
      date: Sequelize.DATE,
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'department',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'position',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('hr_action');
    await queryInterface.dropTable('history_of_changes');
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('file');
    await queryInterface.dropTable('employee');
    await queryInterface.dropTable('passport');
    await queryInterface.dropTable('address');
    await queryInterface.dropTable('position');
    await queryInterface.dropTable('department');
    await queryInterface.dropTable('organisation');
  },
};
