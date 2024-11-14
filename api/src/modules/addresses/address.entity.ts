import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity(`address`)
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  region: string;

  @Column({ type: 'varchar', length: 255 })
  settlement: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  house: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  housing: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  flat: string;
}
