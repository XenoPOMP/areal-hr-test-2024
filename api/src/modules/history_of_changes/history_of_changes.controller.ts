import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { HistoryOfChangesService } from './history_of_changes.service';
import { CreateHistoryOfChangeDto } from './dto/create-history_of_change.dto';
import { UpdateHistoryOfChangeDto } from './dto/update-history_of_change.dto';
import { HistoryOfChange } from '@models/history_of_change.model';

@Controller('history-of-changes')
export class HistoryOfChangesController {
  constructor(private readonly historyService: HistoryOfChangesService) {}

  @Get()
  async findAll(): Promise<HistoryOfChange[]> {
    return this.historyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<HistoryOfChange> {
    const history = await this.historyService.findOne(id);
    if (!history) {
      throw new NotFoundException('History of change not found');
    }
    return history;
  }

  @Post()
  async create({
    createDto,
    req,
  }: {
    createDto: CreateHistoryOfChangeDto;
    req: any;
  }): Promise<HistoryOfChange> {
    const userId = req.user?.id; // Получаем user_id из запроса
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    return this.historyService.create(createDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateHistoryOfChangeDto,
  ): Promise<HistoryOfChange> {
    const updatedHistory = await this.historyService.update(id, updateDto);
    if (!updatedHistory) {
      throw new NotFoundException('History of change not found');
    }
    return updatedHistory;
  }

  @Patch(':id/soft-delete')
  async softDeleteHistory(@Param('id') id: number) {
    await this.historyService.softDeleteHistory(id);
    return;
  }
}
