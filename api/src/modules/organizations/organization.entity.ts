import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organisation')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  org_name: string;

  @Column({ type: 'text', nullable: true })
  org_comment: string;
}