import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Position } from './position.model';
import { Passport } from './passport.model';
import { Address } from './address.model';

@Table({ tableName: 'employee', freezeTableName: true, timestamps: false })
export class Employee extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  surname: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  second_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.DATE, allowNull: true })
  date_birth: string;

  @ForeignKey(() => Position)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  position_id: number;

  @BelongsTo(() => Position)
  position: Position;

  @ForeignKey(() => Passport)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  passport_id: number;

  @BelongsTo(() => Passport)
  passport: Passport;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  address_id: number;

  @BelongsTo(() => Address)
  address: Address;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;

  static async createWithAssociations(
    employeeData: {
      name: string;
      surname: string;
      second_name: string;
      date_birth: string;
      position_id: number | null;
      passport_id?: number;
      address_id?: number;
    },
    passportData: {
      serial: string;
      number: string;
      date_issue: string;
      code: string;
      issued_by: string;
    },
    addressData: {
      region: string;
      settlement: string;
      street: string;
      house: string;
      housing: string;
      flat: string;
    },
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const passport = await Passport.create(
        { ...passportData },
        { transaction },
      );

      const address = await Address.create({ ...addressData }, { transaction });

      const employee = await Employee.create(
        {
          ...employeeData,
          passport_id: passport.id,
          address_id: address.id,
        },
        { transaction },
      );

      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async softDeleteEmployee(id: number): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const employee = await this.findByPk(id, { transaction });
      if (!employee) {
        throw new Error('Employee not found');
      }

      employee.deleted_at = new Date();
      await employee.save({ transaction });

      if (employee.passport) {
        employee.passport.deleted_at = new Date();
        await employee.passport.save({ transaction });
      }

      if (employee.address) {
        employee.address.deleted_at = new Date();
        await employee.address.save({ transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
