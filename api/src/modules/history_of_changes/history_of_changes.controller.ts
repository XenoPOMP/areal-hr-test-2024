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
  Req,
} from '@nestjs/common';
import { HistoryOfChangesService } from './history_of_changes.service';
import { Request } from 'express';
import { HistoryOfChanges } from 'models/history_of_change.model';

@Controller('history-of-changes')
export class HistoryOfChangesController {
  constructor(private readonly historyService: HistoryOfChangesService) {}

  @Post('log-change')
  async addChange(
    @Body() body: any,
    @Session() session: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Req() req: Request,
  ): Promise<void> {
    console.log('Session Data:', session); // Лог всей сессии
    console.log('Session User ID:', session.user?.id); // Проверка наличия user_id

    const userId = session.user?.id;
    if (!userId) {
      console.error('User ID отсутствует в сессии'); // Лог ошибки
      throw new UnauthorizedException('user_id отсутствует');
    }

    const { object, field } = body;
    if (!object || !field) {
      throw new NotFoundException('Объект или поле не указаны');
    }

    console.log('Body:', body);
    await this.historyService.logChange(body.object, body.field, userId);
  }

  @Get()
  async findAll(): Promise<HistoryOfChanges[]> {
    return this.historyService.findAllWithUser();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<HistoryOfChanges> {
    const history = await this.historyService.findOne(id);
    if (!history) {
      throw new NotFoundException('История изменений не найдена');
    }

    return history;
  }

  @Patch(':id/soft-delete')
  async softDeleteHistory(@Param('id') id: number): Promise<void> {
    await this.historyService.softDeleteHistory(id);
  }
}
