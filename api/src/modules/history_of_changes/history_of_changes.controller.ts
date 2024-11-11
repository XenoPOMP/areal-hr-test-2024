import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { HistoryOfChangesService } from './history_of_changes.service';
import { HistoryOfChanges } from './history_of_change.entity';

@Controller('history_of_changes')
export class HistoryOfChangesController {
  constructor(private readonly historyOfChangesService: HistoryOfChangesService) {}

  // Получение всех записей истории изменений
  @Get()
  findAll(): Promise<HistoryOfChanges[]> {
    return this.historyOfChangesService.findAll();
  }

  // Создание новой записи в истории изменений
  @Post()
  create(@Body() changeData: Partial<HistoryOfChanges>): Promise<HistoryOfChanges> {
    return this.historyOfChangesService.create(changeData);
  }

  // Обновление записи в истории изменений по ID
  @Put(':id')
  update(@Param('id') id: number, @Body() changeData: Partial<HistoryOfChanges>): Promise<HistoryOfChanges> {
    return this.historyOfChangesService.update(id, changeData);
  }

  // Удаление записи из истории изменений по ID
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.historyOfChangesService.remove(id);
  }
}
