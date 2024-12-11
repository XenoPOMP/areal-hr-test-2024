import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UnauthorizedException,
  Session,
} from '@nestjs/common';
import {
  HistoryOfChangesService,
  SimplifiedHistoryRecord,
} from './history_of_changes.service';

@Controller('history-of-changes')
export class HistoryOfChangesController {
  constructor(private readonly historyService: HistoryOfChangesService) {}

  @Post()
  async addChange(@Body() body: any, @Session() session: any) {
    const userId = session.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const { object, field, date } = body;
    await this.historyService.createHistoryEntry(object, field, date, userId);
  }

  @Get()
  async findAll(): Promise<SimplifiedHistoryRecord[]> {
    return this.historyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SimplifiedHistoryRecord> {
    const history = await this.historyService.findOne(id);
    if (!history) {
      throw new NotFoundException('History of change not found');
    }

    return {
      object: history.object,
      field: history.field,
      date: history.date,
    };
  }

  @Patch(':id/soft-delete')
  async softDeleteHistory(@Param('id') id: number): Promise<void> {
    await this.historyService.softDeleteHistory(id);
  }
}
