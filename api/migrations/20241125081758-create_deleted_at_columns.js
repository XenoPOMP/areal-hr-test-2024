'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('address', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('department', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('employee', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('file', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('history_of_changes', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('hr_action', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('organisation', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('passport', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('position', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('user', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('address', 'deleted_at');

    await queryInterface.removeColumn('department', 'deleted_at');

    await queryInterface.removeColumn('employee', 'deleted_at');

    await queryInterface.removeColumn('file', 'deleted_at');

    await queryInterface.removeColumn('history_of_changes', 'deleted_at');

    await queryInterface.removeColumn('hr_action', 'deleted_at');

    await queryInterface.removeColumn('organisation', 'deleted_at');

    await queryInterface.removeColumn('passport', 'deleted_at');

    await queryInterface.removeColumn('position', 'deleted_at');

    await queryInterface.removeColumn('user', 'deleted_at');
  },
};
