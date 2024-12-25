import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { User } from 'models/user.model'; // Импорт модели

@Injectable()
export class HistoryOfChangesService {
  constructor(
    @InjectModel(HistoryOfChanges)
    private readonly historyModel: typeof HistoryOfChanges, // Модель HistoryOfChanges
  ) {}

  async logChange(
    object: string,
    field: any,
    user_id: number,
    transaction?: any,
  ): Promise<void> {
    console.log('Логируем изменения:', { object, field, user_id });

    if (!user_id) {
      throw new Error('user_id отсутствует');
    }

    const date = new Date(); // Получаем текущую дату и время
    await this.historyModel.create(
      { object, field, date, user_id },
      { transaction },
    );
  }

  async findAllWithUser(): Promise<HistoryOfChanges[]> {
    return HistoryOfChanges.findAll({
      attributes: ['id', 'object', 'field', 'date', 'user_id'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['login'], // Получаем только логин
        },
      ],
      where: { deleted_at: null },
    });
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
