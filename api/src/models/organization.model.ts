import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'organisation', freezeTableName: true, timestamps: false })
export class Organisation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  comment?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;
}
