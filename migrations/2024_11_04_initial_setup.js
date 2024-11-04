exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('passport', {
        id_passport: { type: 'serial', primaryKey: true },
        serial: { type: 'varchar(10)', notNull: true },
        ph_number: { type: 'varchar(10)', notNull: true },
        date_issue: { type: 'date', notNull: true },
        code: { type: 'varchar(10)' },
        issued_by: { type: 'varchar(255)', notNull: true },
    });

    pgm.createTable('address', {
        id_address: { type: 'serial', primaryKey: true },
        region: { type: 'varchar(255)', notNull: true },
        settlement: { type: 'varchar(255)', notNull: true },
        street: { type: 'varchar(255)', notNull: true },
        house: { type: 'varchar(50)' },
        housing: { type: 'varchar(50)' },
        flat: { type: 'varchar(50)' },
    });

    pgm.createTable('employee', {
        id_employee: { type: 'serial', primaryKey: true },
        emp_name: { type: 'varchar(100)', notNull: true },
        surname: { type: 'varchar(100)', notNull: true },
        second_name: { type: 'varchar(100)' },
        date_birth: { type: 'date', notNull: true },
        id_passport: { type: 'int', references: 'passport(id_passport)', onDelete: 'SET NULL' },
        id_address: { type: 'int', references: 'address(id_address)', onDelete: 'SET NULL' },
        id_position: { type: 'int', references: 'app_position(id_position)', onDelete: 'SET NULL' },
        id_file: { type: 'int', references: 'app_file(id_file)', onDelete: 'SET NULL' },
    });

    pgm.createTable('organisation', {
        id_organisation: { type: 'serial', primaryKey: true },
        org_name: { type: 'varchar(255)', notNull: true },
        org_comment: { type: 'text' },
    });

    pgm.createTable('app_file', {
        id_file: { type: 'serial', primaryKey: true },
        file_name: { type: 'varchar(255)', notNull: true },
        file_link: { type: 'text', notNull: true },
    });

    pgm.createTable('department', {
        id_department: { type: 'serial', primaryKey: true },
        id_organisation: { type: 'int', references: 'organisation(id_organisation)', onDelete: 'CASCADE' },
        dep_name: { type: 'varchar(255)', notNull: true },
        id_parent: { type: 'int', references: 'department(id_department)', onDelete: 'SET NULL' },
        dep_comment: { type: 'text' },
        id_employee: { type: 'int', references: 'employee(id_employee)', onDelete: 'SET NULL' },
    });

    pgm.createTable('hraction', {
        id_action: { type: 'serial', primaryKey: true },
        action_type: { type: 'varchar(50)', notNull: true },
        id_employee: { type: 'int', references: 'employee(id_employee)', onDelete: 'SET NULL' },
        id_department: { type: 'int', references: 'department(id_department)', onDelete: 'SET NULL' },
        id_position: { type: 'int', references: 'app_position(id_position)', onDelete: 'SET NULL' },
        date_action: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });

    pgm.createTable('app_position', {
        id_position: { type: 'serial', primaryKey: true },
        pos_name: { type: 'varchar(255)', notNull: true },
    });

    pgm.createTable('app_user', {
        id_user: { type: 'serial', primaryKey: true },
        first_name: { type: 'varchar(100)', notNull: true },
        surname: { type: 'varchar(100)', notNull: true },
        second_name: { type: 'varchar(100)' },
        login: { type: 'varchar(50)', unique: true, notNull: true },
        passwrd: { type: 'varchar(255)', notNull: true },
    });

    pgm.createTable('history_of_changes', {
        id_change: { type: 'serial', primaryKey: true },
        date: { type: 'date', default: pgm.func('current_date') },
        time: { type: 'time', default: pgm.func('current_time') },
        login: { type: 'varchar(50)', references: 'app_user(login)' },
        object: { type: 'varchar(255)', notNull: true },
        field: { type: 'varchar(255)', notNull: true },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('history_of_changes');
    pgm.dropTable('app_user');
    pgm.dropTable('app_position');
    pgm.dropTable('hraction');
    pgm.dropTable('department');
    pgm.dropTable('app_file');
    pgm.dropTable('organisation');
    pgm.dropTable('employee');
    pgm.dropTable('address');
    pgm.dropTable('passport');
};