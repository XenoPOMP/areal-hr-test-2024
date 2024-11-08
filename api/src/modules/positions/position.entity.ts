import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('position')
export class Position {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;
}