import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'history_of_changes',
  freezeTableName: true,
  timestamps: false,
})
export class HistoryOfChanges extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  object: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  field?: Record<string, any>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deleted_at: Date | null;
}
