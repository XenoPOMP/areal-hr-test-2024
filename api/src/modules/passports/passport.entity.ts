import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('passport')
export class Passport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  serial: string;

  @Column({ type: 'varchar', length: 10 })
  number: string;

  @Column({ type: 'date' })
  date_issue: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  issued_by: string;
}
