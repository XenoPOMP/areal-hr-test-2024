'use strict';

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Вставляем или обновляем данные в таблице organisation
      const organisations = await queryInterface.bulkInsert(
        'organisation',
        [
          {
            name: 'Организация 1',
            comment: 'Комментарий к организации 1',
            deleted_at: null,
          },
          {
            name: 'Организация 2',
            comment: 'Комментарий к организации 2',
            deleted_at: null,
          },
          {
            name: 'Организация 3',
            comment: 'Комментарий к организации 3',
            deleted_at: null,
          },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице position
      const positions = await queryInterface.bulkInsert(
        'position',
        [
          { name: 'Менеджер', deleted_at: null },
          { name: 'Разработчик', deleted_at: null },
          { name: 'Аналитик', deleted_at: null },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице address
      const addresses = await queryInterface.bulkInsert(
        'address',
        [
          {
            region: 'Регион 1',
            settlement: 'Поселение 1',
            street: 'Улица 1',
            house: '10',
            housing: '1',
            flat: '1',
            deleted_at: null,
          },
          {
            region: 'Регион 2',
            settlement: 'Поселение 2',
            street: 'Улица 2',
            house: '20',
            housing: '2',
            flat: '2',
            deleted_at: null,
          },
          {
            region: 'Регион 3',
            settlement: 'Поселение 3',
            street: 'Улица 3',
            house: '30',
            housing: '3',
            flat: '3',
            deleted_at: null,
          },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице passport
      const passports = await queryInterface.bulkInsert(
        'passport',
        [
          {
            serial: '1234',
            number: '567890',
            date_issue: '2020-01-01',
            code: '111-111',
            issued_by: 'УМВД 1',
            deleted_at: null,
          },
          {
            serial: '2345',
            number: '678901',
            date_issue: '2021-02-01',
            code: '222-222',
            issued_by: 'УМВД 2',
            deleted_at: null,
          },
          {
            serial: '3456',
            number: '789012',
            date_issue: '2022-03-01',
            code: '333-333',
            issued_by: 'УМВД 3',
            deleted_at: null,
          },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице department
      const departments = await queryInterface.bulkInsert(
        'department',
        [
          {
            name: 'Отдел 1',
            comment: 'Комментарий к отделу 1',
            organisation_id: organisations[0].id,
            parent_id: null,
            deleted_at: null,
          },
          {
            name: 'Отдел 2',
            comment: 'Комментарий к отделу 2',
            organisation_id: organisations[1].id,
            parent_id: null,
            deleted_at: null,
          },
          {
            name: 'Отдел 3',
            comment: 'Комментарий к отделу 3',
            organisation_id: organisations[2].id,
            parent_id: null,
            deleted_at: null,
          },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице employee
      const employees = await queryInterface.bulkInsert(
        'employee',
        [
          {
            surname: 'Иванов',
            second_name: 'Иван',
            name: 'Иван',
            date_birth: '1985-01-01',
            position_id: positions[0].id,
            passport_id: passports[0].id,
            address_id: addresses[0].id,
            deleted_at: null,
          },
          {
            surname: 'Петров',
            second_name: 'Петр',
            name: 'Петр',
            date_birth: '1990-02-02',
            position_id: positions[1].id,
            passport_id: passports[1].id,
            address_id: addresses[1].id,
            deleted_at: null,
          },
          {
            surname: 'Сидоров',
            second_name: 'Сидор',
            name: 'Сидор',
            date_birth: '1995-03-03',
            position_id: positions[2].id,
            passport_id: passports[2].id,
            address_id: addresses[2].id,
            deleted_at: null,
          },
        ],
        { returning: true, transaction },
      );

      // Вставляем или обновляем данные в таблице file
      await queryInterface.bulkInsert(
        'file',
        [
          {
            name: 'Файл 1',
            link: 'link1',
            employee_id: employees[0].id,
            deleted_at: null,
          },
          {
            name: 'Файл 2',
            link: 'link2',
            employee_id: employees[1].id,
            deleted_at: null,
          },
          {
            name: 'Файл 3',
            link: 'link3',
            employee_id: employees[2].id,
            deleted_at: null,
          },
        ],
        { transaction },
      );

      // Вставляем или обновляем данные в таблице hr_action
      await queryInterface.bulkInsert(
        'hr_action',
        [
          {
            action_type: 'Прием',
            date: '2023-01-01',
            employee_id: employees[0].id,
            department_id: departments[0].id,
            position_id: positions[0].id,
            salary: 50000,
            deleted_at: null,
          },
          {
            action_type: 'Прием',
            date: '2023-02-02',
            employee_id: employees[1].id,
            department_id: departments[1].id,
            position_id: positions[1].id,
            salary: 60000,
            deleted_at: null,
          },
          {
            action_type: 'Прием',
            date: '2023-03-03',
            employee_id: employees[2].id,
            department_id: departments[2].id,
            position_id: positions[2].id,
            salary: 70000,
            deleted_at: null,
          },
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Удаляем данные в обратном порядке с учетом транзакции
      await queryInterface.bulkDelete('hr_action', null, { transaction });
      await queryInterface.bulkDelete('file', null, { transaction });
      await queryInterface.bulkDelete('employee', null, { transaction });
      await queryInterface.bulkDelete('department', null, { transaction });
      await queryInterface.bulkDelete('passport', null, { transaction });
      await queryInterface.bulkDelete('position', null, { transaction });
      await queryInterface.bulkDelete('address', null, { transaction });
      await queryInterface.bulkDelete('organisation', null, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
