'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создание таблицы "SequelizeMeta"
    await queryInterface.createTable('SequelizeMeta', {
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
    });

    // Создание таблицы "address"
    await queryInterface.createTable('address', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        allowNull: true,
      },
      housing: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      flat: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });

    // Создание таблицы "department"
    await queryInterface.createTable('department', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      organisation_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Создание таблицы "employee"
    await queryInterface.createTable('employee', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      date_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      position_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Создание таблицы "file"
    await queryInterface.createTable('file', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Создание таблицы "history_of_changes"
    await queryInterface.createTable('history_of_changes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      object: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      field: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Создание таблицы "hr_action"
    await queryInterface.createTable('hr_action', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      action_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      position_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      salary: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    // Создание таблицы "organisation"
    await queryInterface.createTable('organisation', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // Создание таблицы "passport"
    await queryInterface.createTable('passport', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        allowNull: true,
      },
      issued_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    // Создание таблицы "position"
    await queryInterface.createTable('position', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    // Создание таблицы "user"
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        allowNull: true,
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
        allowNull: true,
      },
    });

    // Добавление внешних ключей и индексов
    await queryInterface.addConstraint('department', {
      fields: ['organisation_id'],
      type: 'foreign key',
      name: 'dep_org_fk',
      references: {
        table: 'organisation',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('department', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'parent_fk',
      references: {
        table: 'department',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('employee', {
      fields: ['id'],
      type: 'foreign key',
      name: 'add_emp_fk',
      references: {
        table: 'address',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    });

    await queryInterface.addConstraint('employee', {
      fields: ['id'],
      type: 'foreign key',
      name: 'pass_emp_fk',
      references: {
        table: 'passport',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    });

    await queryInterface.addConstraint('employee', {
      fields: ['position_id'],
      type: 'foreign key',
      name: 'pos_emp_fk',
      references: {
        table: 'position',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    });

    await queryInterface.addConstraint('file', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'file_emp_fk',
      references: {
        table: 'employee',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('history_of_changes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'hoc_user_fk',
      references: {
        table: 'user',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('hr_action', {
      fields: ['department_id'],
      type: 'foreign key',
      name: 'hr_dep_fk',
      references: { table: 'department', field: 'id' },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('hr_action', {
      fields: ['position_id'],
      type: 'foreign key',
      name: 'hr_pos_fk',
      references: {
        table: 'position',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('hr_action', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'hr_emp_fk',
      references: {
        table: 'employee',
        field: 'id',
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
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
    await queryInterface.dropTable('SequelizeMeta');
  },
};
