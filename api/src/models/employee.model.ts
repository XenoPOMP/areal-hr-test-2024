import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
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

  @HasOne(() => Passport, { foreignKey: 'id' })
  passport: Passport;

  @HasOne(() => Address, { foreignKey: 'id' })
  address: Address;

  // Статический метод для создания сотрудника с ассоциациями
  static async createWithAssociations(
    employeeData: {
      name: string;
      surname: string;
      second_name: string;
      date_birth: string;
      position_id: number;
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
      const employee = await Employee.create(employeeData, { transaction });

      await Passport.create(
        { ...passportData, id: employee.id },
        { transaction },
      );
      await Address.create(
        { ...addressData, id: employee.id },
        { transaction },
      );

      await transaction.commit();
      return employee;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
