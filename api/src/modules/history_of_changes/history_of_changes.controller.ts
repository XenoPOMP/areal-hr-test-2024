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
    @Req() req: Request,
  ): Promise<void> {
    console.log('Cookies:', req.cookies);
    console.log('Session ID:', req.sessionID);
    const userId = session.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Пользователь не аутентифицирован');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { object, field, date } = body;

    if (!object || !field) {
      throw new NotFoundException('Объект или поле не указаны');
    }

    // Замените createHistoryEntry на logChange
    await this.historyService.logChange(object, field, userId);
    console.log('Session user:', session.user);
  }

  @Get()
  async findAll(): Promise<HistoryOfChanges[]> {
    return this.historyService.findAll();
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
