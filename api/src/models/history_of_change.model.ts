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
import { User } from './user.model'; // Импортируем модель User

@Table({
  tableName: 'history_of_change',
  freezeTableName: true,
  timestamps: false,
})
export class HistoryOfChange extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  object?: string; // Название объекта, с которым произошло изменение

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  field?: object; // Данные поля, которые изменились

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date?: string; // Дата изменения

  @ForeignKey(() => User) // Связь с таблицей пользователей
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id?: number; // id пользователя, который сделал изменение

  @BelongsTo(() => User) // Устанавливаем связь с пользователем
  user: User;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;
}
