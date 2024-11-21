import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table
export class Address extends Model {
  @PrimaryKey
  @ForeignKey(() => Employee)
  @Column
  id: number;

  @Column
  region: string;

  @Column
  settlement: string;

  @Column
  street: string;

  @Column
  house?: string;

  @Column
  housing?: string;

  @Column
  flat?: string;
}
