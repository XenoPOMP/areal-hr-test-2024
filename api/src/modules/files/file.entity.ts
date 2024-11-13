import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  link: string;
}
