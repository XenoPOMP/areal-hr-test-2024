import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => Passport, { cascade: true, eager: true })
  @JoinColumn()
  passport: Passport;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn()
  address: Address;
}
