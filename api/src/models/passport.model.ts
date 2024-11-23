import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
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

  @Column({ type: DataType.STRING, allowNull: false })
  serial: string;

  @Column({ type: DataType.STRING, allowNull: false })
  number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  date_issue: string;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  issued_by: string;

  @BelongsTo(() => Employee, { foreignKey: 'id' })
  employee: Employee;
}
