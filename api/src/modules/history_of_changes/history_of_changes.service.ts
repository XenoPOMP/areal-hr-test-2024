import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryOfChanges } from 'src/models/history_of_change.model'; // Импорт модели

@Injectable()
export class HistoryOfChangesService {
  constructor(
    @InjectModel(HistoryOfChanges)
    private readonly historyModel: typeof HistoryOfChanges, // Модель HistoryOfChanges
  ) {}

  async logChange(object: string, field: any, userId: number): Promise<void> {
    console.log('Логирование изменений:', { object, field, userId });
    if (!userId) throw new Error('userId отсутствует');
    await this.historyModel.create({ object, field, user_id: userId });
  }

  async findAll(): Promise<HistoryOfChanges[]> {
    return this.historyModel.findAll();
  }

  async findOne(id: number): Promise<HistoryOfChanges | undefined> {
    return this.historyModel.findByPk(id);
  }

  async softDeleteHistory(id: number): Promise<void> {
    const record = await this.historyModel.findByPk(id);
    if (record) {
      record.deleted_at = new Date();
      await record.save();
    }
  }
}
