import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryOfChanges } from './history_of_change.entity';

@Injectable()
export class HistoryOfChangesService {
  constructor(
    @InjectRepository(HistoryOfChanges)
    private readonly historyOfChangesRepository: Repository<HistoryOfChanges>,
  ) {}

  // Получение всех записей истории изменений
  async findAll(): Promise<HistoryOfChanges[]> {
    return this.historyOfChangesRepository.find();
  }

  // Получение записи истории изменений по ID
  async findOne(id: number): Promise<HistoryOfChanges> {
    const historyRecord = await this.historyOfChangesRepository.findOne({
      where: { id },
    });
    if (!historyRecord) {
      throw new NotFoundException(`History of Change with ID ${id} not found`);
    }
    return historyRecord;
  }

  // Создание новой записи в истории изменений
  async create(
    changeData: Partial<HistoryOfChanges>,
  ): Promise<HistoryOfChanges> {
    const historyRecord = this.historyOfChangesRepository.create(changeData);
    return this.historyOfChangesRepository.save(historyRecord);
  }

  // Обновление записи в истории изменений по ID
  async update(
    id: number,
    changeData: Partial<HistoryOfChanges>,
  ): Promise<HistoryOfChanges> {
    await this.historyOfChangesRepository.update(id, changeData);
    const updatedHistoryRecord = await this.findOne(id); // Проверяем наличие обновленной записи
    return updatedHistoryRecord;
  }

  // Удаление записи из истории изменений по ID
  async remove(id: number): Promise<void> {
    const deleteResult = await this.historyOfChangesRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`History of Change with ID ${id} not found`);
    }
  }
}
