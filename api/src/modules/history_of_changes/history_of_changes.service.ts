import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryOfChange } from './history_of_change.model';
import { CreateHistoryOfChangeDto } from './dto/create-history_of_change.dto';
import { UpdateHistoryOfChangeDto } from './dto/update-history_of_change.dto';

@Injectable()
export class HistoryOfChangesService {
  constructor(
    @InjectModel(HistoryOfChange)
    private readonly historyOfChangeModel: typeof HistoryOfChange,
  ) {}

  async findAll(): Promise<HistoryOfChange[]> {
    return this.historyOfChangeModel.findAll();
  }

  async findOne(id: number): Promise<HistoryOfChange | null> {
    return this.historyOfChangeModel.findByPk(id);
  }

  async create(
    dto: CreateHistoryOfChangeDto,
    userId: number,
  ): Promise<HistoryOfChange> {
    return this.historyOfChangeModel.create({
      ...dto,
      user_id: userId, // Добавляем user_id
    });
  }

  async update(
    id: number,
    dto: UpdateHistoryOfChangeDto,
  ): Promise<HistoryOfChange | null> {
    const history = await this.historyOfChangeModel.findByPk(id);
    if (history) {
      return history.update(dto);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const history = await this.historyOfChangeModel.findByPk(id);
    if (history) {
      await history.destroy();
    }
  }
}
