import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'position',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at',
})
export class Position extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;
}
