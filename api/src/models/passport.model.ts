import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table
export class Passport extends Model {
  @PrimaryKey
  @ForeignKey(() => Employee)
  @Column
  id: number;

  @Column
  serial: string;

  @Column
  number: string;

  @Column
  date_issue: string;

  @Column
  code: string;

  @Column
  issued_by: string;
}
