import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Passport } from '../passports/passport.entity';
import { Address } from '../addresses/address.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  surname: string;

  @Column({ type: 'varchar', length: 100 })
  second_name: string;

  @Column({ type: 'date', nullable: true })
  date_birth: Date;

  @ManyToOne(() => Passport, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'passport_id' })
  passport: Passport;

  @ManyToOne(() => Address, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
