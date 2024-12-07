import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'user',
  freezeTableName: true,
  timestamps: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  second_name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  role: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date | null;
}
