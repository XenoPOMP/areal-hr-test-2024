/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Создание таблиц
  pgm.createTable('address', {
    id: { type: 'integer', primaryKey: true },
    region: { type: 'varchar(255)', notNull: true },
    settlement: { type: 'varchar(255)', notNull: true },
    street: { type: 'varchar(255)', notNull: true },
    house: { type: 'varchar(50)' },
    housing: { type: 'varchar(50)' },
    flat: { type: 'varchar(50)' }
  });

  pgm.createSequence('address_id_address_seq', { start: 1, increment: 1 });
  pgm.alterColumn('address', 'id', { default: pgm.func('nextval(\'public.address_id_address_seq\')') });

  pgm.createTable('file', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    link: { type: 'text', notNull: true }
  });

  pgm.createSequence('app_file_id_file_seq', { start: 1, increment: 1 });
  pgm.alterColumn('file', 'id', { default: pgm.func('nextval(\'public.app_file_id_file_seq\')') });

  pgm.createTable('user', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },
    surname: { type: 'varchar(100)', notNull: true },
    second_name: { type: 'varchar(100)' },
    login: { type: 'varchar(50)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true }
  });

  pgm.createSequence('app_user_id_user_seq', { start: 1, increment: 1 });
  pgm.alterColumn('user', 'id', { default: pgm.func('nextval(\'public.app_user_id_user_seq\')') });

  pgm.createTable('department', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' }
  });

  pgm.createSequence('department_id_department_seq', { start: 1, increment: 1 });
  pgm.alterColumn('department', 'id', { default: pgm.func('nextval(\'public.department_id_department_seq\')') });

  pgm.createTable('employee', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },
    surname: { type: 'varchar(100)', notNull: true },
    second_name: { type: 'varchar(100)' },
    date_birth: { type: 'date', notNull: true },
    passport_id: { type: 'integer' },
    address_id: { type: 'integer' },
    position_id: { type: 'integer' },
    file_id: { type: 'integer' }
  });

  pgm.createSequence('employee_id_employee_seq', { start: 1, increment: 1 });
  pgm.alterColumn('employee', 'id', { default: pgm.func('nextval(\'public.employee_id_employee_seq\')') });

  pgm.createTable('history_of_changes', {
    id: { type: 'integer', primaryKey: true },
    date: { type: 'date', default: pgm.func('CURRENT_DATE') },
    time: { type: 'time', default: pgm.func('CURRENT_TIME') },
    login: { type: 'varchar(50)' },
    object: { type: 'varchar(255)', notNull: true },
    user_id: { type: 'integer' },
    field: { type: 'json' }
  });

  pgm.createSequence('history_of_changes_id_change_seq', { start: 1, increment: 1 });
  pgm.alterColumn('history_of_changes', 'id', { default: pgm.func('nextval(\'public.history_of_changes_id_change_seq\')') });

  pgm.createTable('hr_action', {
    id: { type: 'integer', primaryKey: true },
    action_type: { type: 'varchar(50)', notNull: true },
    employee_id: { type: 'integer' },
    department_id: { type: 'integer' },
    position_id: { type: 'integer' },
    date: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.createSequence('hraction_id_action_seq', { start: 1, increment: 1 });
  pgm.alterColumn('hr_action', 'id', { default: pgm.func('nextval(\'public.hraction_id_action_seq\')') });

  pgm.createTable('organisation', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' }
  });

  pgm.createSequence('organisation_id_seq', { start: 1, increment: 1 });
  pgm.alterColumn('organisation', 'id', { default: pgm.func('nextval(\'public.organisation_id_seq\')') });

  pgm.createTable('passport', {
    id: { type: 'integer', primaryKey: true },
    serial: { type: 'varchar(10)', notNull: true },
    number: { type: 'varchar(10)', notNull: true },
    date_issue: { type: 'date', notNull: true },
    code: { type: 'varchar(10)' },
    issued_by: { type: 'varchar(255)', notNull: true }
  });

  pgm.createSequence('passport_id_passport_seq', { start: 1, increment: 1 });
  pgm.alterColumn('passport', 'id', { default: pgm.func('nextval(\'public.passport_id_passport_seq\')') });

  pgm.createTable('position', {
    id: { type: 'integer', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true }
  });

  pgm.createSequence('position_id_seq', { start: 1, increment: 1 });
  pgm.alterColumn('position', 'id', { default: pgm.func('nextval(\'public.position_id_seq\')') });

  // Добавление внешних ключей
  pgm.addConstraint('employee', 'employee_id_address_fkey', {
    foreignKeys: {
      columns: ['address_id'],
      references: 'address(id)',
      onDelete: 'SET NULL'
    }
  });

  pgm.addConstraint('employee', 'employee_id_file_fkey', {
    foreignKeys: {
      columns: ['file_id'],
      references: 'file(id)',
      onDelete: 'SET NULL'
    }
  });

  pgm.addConstraint('employee', 'employee_id_passport_fkey', {
    foreignKeys: {
      columns: ['passport_id'],
      references: 'passport(id)',
      onDelete: 'SET NULL'
    }
  });

  pgm.addConstraint('history_of_changes', 'fk_history_user', {
    foreignKeys: {
      columns: ['user_id'],
      references: 'user(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });

  pgm.addConstraint('hr_action', 'hraction_id_employee_fkey', {
    foreignKeys: {
      columns: ['employee_id'],
      references: 'employee(id)',
      onDelete: 'SET NULL'
    }
  });

  pgm.addConstraint('hr_action', 'hraction_id_department_fkey', {
    foreignKeys: {
      columns: ['department_id'],
      references: 'department(id)',
      onDelete: 'SET NULL'
    }
  });

  // Создание уникальных и первичных ключей
  pgm.createIndex('user', 'login', { unique: true });
  pgm.createIndex('user', 'id', { unique: true });

  pgm.addConstraint('address', 'address_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('file', 'file_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('department', 'department_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('employee', 'employee_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('history_of_changes', 'history_of_changes_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('hr_action', 'hraction_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('organisation', 'organisation_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('passport', 'passport_pkey', {
    primaryKey: ['id']
  });
  pgm.addConstraint('position', 'position_pkey', {
    primaryKey: ['id']
  });
};

exports.down = (pgm) => {
  // Удаление таблиц и внешних ключей в случае отката
  pgm.dropConstraint('employee', 'employee_id_address_fkey');
  pgm.dropConstraint('employee', 'employee_id_file_fkey');
  pgm.dropConstraint('employee', 'employee_id_passport_fkey');
  pgm.dropConstraint('history_of_changes', 'fk_history_user');
  pgm.dropConstraint('hr_action', 'hraction_id_employee_fkey');
  pgm.dropConstraint('hr_action', 'hraction_id_department_fkey');
  
  pgm.dropTable('address');
  pgm.dropTable('file');
  pgm.dropTable('user');
  pgm.dropTable('department');
  pgm.dropTable('employee');
  pgm.dropTable('history_of_changes');
  pgm.dropTable('hr_action');
  pgm.dropTable('organisation');
  pgm.dropTable('passport');
  pgm.dropTable('position');
};