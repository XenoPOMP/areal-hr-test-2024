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

@Table({ tableName: 'passport', freezeTableName: true, timestamps: false })
export class Passport extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(10) })
  serial: string;

  @Column({ type: DataType.STRING(10) })
  number: string;

  @Column({ type: DataType.DATEONLY })
  date_issue: string;

  @Column({ type: DataType.STRING(10), allowNull: true })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  issued_by: string;

  @BelongsTo(() => Employee, { foreignKey: 'id' })
  employee: Employee;
}
