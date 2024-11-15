import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'positions' })
export class Position extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;
}
