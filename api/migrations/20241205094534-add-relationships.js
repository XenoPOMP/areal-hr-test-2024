'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const constraints = [
      {
        table: 'department',
        fields: ['organisation_id'],
        constraintName: 'dep_org_fk',
        sql: `
          ALTER TABLE department
          ADD CONSTRAINT dep_org_fk FOREIGN KEY (organisation_id)
          REFERENCES organisation (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'department',
        fields: ['parent_id'],
        constraintName: 'parent_fk',
        sql: `
          ALTER TABLE department
          ADD CONSTRAINT parent_fk FOREIGN KEY (parent_id)
          REFERENCES department (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'employee',
        fields: ['address_id'],
        constraintName: 'add_emp_fk',
        sql: `
          ALTER TABLE employee
          ADD CONSTRAINT add_emp_fk FOREIGN KEY (address_id)
          REFERENCES address (id)
          ON UPDATE NO ACTION
          ON DELETE NO ACTION;
        `,
      },
      {
        table: 'employee',
        fields: ['passport_id'],
        constraintName: 'pass_emp_fk',
        sql: `
          ALTER TABLE employee
          ADD CONSTRAINT pass_emp_fk FOREIGN KEY (passport_id)
          REFERENCES passport (id)
          ON UPDATE NO ACTION
          ON DELETE NO ACTION;
        `,
      },
      {
        table: 'employee',
        fields: ['position_id'],
        constraintName: 'pos_emp_fk',
        sql: `
          ALTER TABLE employee
          ADD CONSTRAINT pos_emp_fk FOREIGN KEY (position_id)
          REFERENCES position (id)
          ON UPDATE NO ACTION
          ON DELETE NO ACTION;
        `,
      },
      {
        table: 'file',
        fields: ['employee_id'],
        constraintName: 'file_emp_fk',
        sql: `
          ALTER TABLE file
          ADD CONSTRAINT file_emp_fk FOREIGN KEY (employee_id)
          REFERENCES employee (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'history_of_changes',
        fields: ['user_id'],
        constraintName: 'hoc_user_fk',
        sql: `
          ALTER TABLE history_of_changes
          ADD CONSTRAINT hoc_user_fk FOREIGN KEY (user_id)
          REFERENCES "user" (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'hr_action',
        fields: ['department_id'],
        constraintName: 'hr_dep_fk',
        sql: `
          ALTER TABLE hr_action
          ADD CONSTRAINT hr_dep_fk FOREIGN KEY (department_id)
          REFERENCES department (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'hr_action',
        fields: ['employee_id'],
        constraintName: 'hr_emp_fk',
        sql: `
          ALTER TABLE hr_action
          ADD CONSTRAINT hr_emp_fk FOREIGN KEY (employee_id)
          REFERENCES employee (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
      {
        table: 'hr_action',
        fields: ['position_id'],
        constraintName: 'hr_pos_fk',
        sql: `
          ALTER TABLE hr_action
          ADD CONSTRAINT hr_pos_fk FOREIGN KEY (position_id)
          REFERENCES position (id)
          ON UPDATE RESTRICT
          ON DELETE RESTRICT;
        `,
      },
    ];

    for (const { table, constraintName, sql } of constraints) {
      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = '${constraintName}'
          ) THEN
            ${sql}
          END IF;
        END $$;
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const constraints = [
      { table: 'hr_action', constraintName: 'hr_pos_fk' },
      { table: 'hr_action', constraintName: 'hr_emp_fk' },
      { table: 'hr_action', constraintName: 'hr_dep_fk' },
      { table: 'history_of_changes', constraintName: 'hoc_user_fk' },
      { table: 'file', constraintName: 'file_emp_fk' },
      { table: 'employee', constraintName: 'pos_emp_fk' },
      { table: 'employee', constraintName: 'pass_emp_fk' },
      { table: 'employee', constraintName: 'add_emp_fk' },
      { table: 'department', constraintName: 'parent_fk' },
      { table: 'department', constraintName: 'dep_org_fk' },
    ];

    for (const { table, constraintName } of constraints) {
      await queryInterface.removeConstraint(table, constraintName);
    }
  },
};
