import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Employee } from './employee.model'; // Импорт модели сотрудника

@Table({ tableName: 'file', freezeTableName: true, timestamps: false })
export class File extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  link: string;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: true })
  employee_id?: number;
}
