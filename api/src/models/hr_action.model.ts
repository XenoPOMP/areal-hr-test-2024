import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.model';
import { Department } from './department.model';
import { Position } from './position.model';

@Table({ tableName: 'hr_action', freezeTableName: true, timestamps: false })
export class HrAction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  action_type: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  employee_id: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  department_id: number;

  @ForeignKey(() => Position)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salary: number;

  // Связи
  @BelongsTo(() => Employee)
  employee: Employee;

  @BelongsTo(() => Department)
  department: Department;

  @BelongsTo(() => Position)
  position: Position;
}
