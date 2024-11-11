import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  surname: string;

  @Column({ type: 'varchar', length: 100  })
  second_name: string;

  @Column({ type: 'date', nullable: true })
  date_birth: Date;
}