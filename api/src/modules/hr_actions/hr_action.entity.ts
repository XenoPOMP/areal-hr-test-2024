import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hr_action')
export class HRAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  action_type: string;

  @Column({ type: 'date', nullable: true })
  date: Date;
}