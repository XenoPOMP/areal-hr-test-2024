import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryOfChanges } from '@models/history_of_change.model';

export interface SimplifiedHistoryRecord {
  object: string;
  field: Record<string, any>;
  date: Date;
}

@Injectable()
export class HistoryOfChangesService {
  constructor(
    @InjectModel(HistoryOfChanges)
    private readonly historyOfChangeModel: typeof HistoryOfChanges,
  ) {}

  async createHistoryEntry(
    object: string,
    field: any,
    date: Date,
    user_id: number,
  ): Promise<void> {
    await this.historyOfChangeModel.create({
      object,
      field,
      date,
      user_id,
    });
  }

  async findAll(): Promise<SimplifiedHistoryRecord[]> {
    const history = await this.historyOfChangeModel.findAll({
      where: { deleted_at: null },
    });

    return history.map((entry) => ({
      object: entry.object,
      field: entry.field,
      date: entry.date,
    }));
  }

  async findOne(id: number): Promise<HistoryOfChanges | null> {
    return this.historyOfChangeModel.findOne({
      where: { id, deleted_at: null },
    });
  }

  async softDeleteHistory(id: number): Promise<void> {
    const historyOfChanges = await this.historyOfChangeModel.findOne({
      where: { id, deleted_at: null },
    });

    if (!historyOfChanges) {
      throw new Error('History of change not found');
    }

    historyOfChanges.deleted_at = new Date();
    await historyOfChanges.save();
  }
}
