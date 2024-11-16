import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table({ tableName: 'address', freezeTableName: true, timestamps: false })
export class Address extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(255) })
  region: string;

  @Column({ type: DataType.STRING(255) })
  settlement: string;

  @Column({ type: DataType.STRING(255) })
  street: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  house: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  housing: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  flat: string;

  @BelongsTo(() => Employee, { foreignKey: 'id' })
  employee: Employee;
}
