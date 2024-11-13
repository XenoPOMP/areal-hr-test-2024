import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HRActionsService } from './hr_actions.service';
import { HRAction } from './hr_action.entity';

@Controller('hr_actions')
export class HRActionsController {
  constructor(private readonly hrActionsService: HRActionsService) {}

  // Получение всех HR действий
  @Get()
  findAll(): Promise<HRAction[]> {
    return this.hrActionsService.findAll();
  }

  // Создание нового HR действия
  @Post()
  create(@Body() actionData: Partial<HRAction>): Promise<HRAction> {
    return this.hrActionsService.create(actionData);
  }

  // Обновление HR действия по ID
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() actionData: Partial<HRAction>,
  ): Promise<HRAction> {
    return this.hrActionsService.update(id, actionData);
  }

  // Удаление HR действия по ID
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.hrActionsService.remove(id);
  }
}
