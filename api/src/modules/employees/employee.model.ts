import {
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { Position } from '../positions/position.model';
import { Passport } from '../passports/passport.model';
import { Address } from '../addresses/address.model'; // Импорт модели позиции

@Table({ tableName: 'employee', freezeTableName: true, timestamps: false })
export class Employee extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  surname: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  second_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.DATE, allowNull: true })
  date_birth: string;

  @ForeignKey(() => Position)
  @Column({ type: DataType.INTEGER, allowNull: true })
  position_id: number;

  @BelongsTo(() => Position)
  position: Position;

  @HasOne(() => Passport, { foreignKey: 'id' })
  passport: Passport;

  @HasOne(() => Address, { foreignKey: 'id' })
  address: Address;
}
