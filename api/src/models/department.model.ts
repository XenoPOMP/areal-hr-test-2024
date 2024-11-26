import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'department', freezeTableName: true, timestamps: false })
export class Department extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  comment?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parent_id?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  organisation_id?: number;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;
}
