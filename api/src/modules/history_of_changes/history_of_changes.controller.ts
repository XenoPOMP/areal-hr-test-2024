import {
  Controller,
  Get,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  HistoryOfChangesService,
  SimplifiedHistoryRecord,
} from './history_of_changes.service';
import { HistoryOfChanges } from '@models/history_of_change.model';

@Controller('history-of-changes')
export class HistoryOfChangesController {
  constructor(private readonly historyService: HistoryOfChangesService) {}

  @Get()
  async findAll(): Promise<SimplifiedHistoryRecord[]> {
    return this.historyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<HistoryOfChanges> {
    const history = await this.historyService.findOne(id);
    if (!history) {
      throw new NotFoundException('History of change not found');
    }
    return history;
  }

  @Patch(':id/soft-delete')
  async softDeleteHistory(@Param('id') id: number): Promise<void> {
    await this.historyService.softDeleteHistory(id);
    return;
  }
}
