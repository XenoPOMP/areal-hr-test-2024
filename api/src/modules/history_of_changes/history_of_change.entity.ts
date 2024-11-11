import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('history_of_changes')
export class HistoryOfChanges {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  login: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  object: string;

  @Column({ type: 'int', nullable: true })
  user_id: number; // Тип изменён на int для хранения идентификатора пользователя

  @Column({ type: 'json', nullable: true })
  field: any; // Используем json для хранения данных в формате JSON
}