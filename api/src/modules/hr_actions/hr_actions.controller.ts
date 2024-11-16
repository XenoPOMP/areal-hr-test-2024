import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { HrActionsService } from './hr_actions.service';
import { CreateHrActionDto } from './dto/create-hr_action.dto';
import { HrAction } from '@models/hr_action.model';

@Controller('hr-actions')
export class HrActionsController {
  constructor(private readonly hrActionsService: HrActionsService) {}

  @Get()
  async findAll(): Promise<HrAction[]> {
    return this.hrActionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<HrAction> {
    const action = await this.hrActionsService.findOne(id);
    if (!action) {
      throw new NotFoundException('HR action not found');
    }
    return action;
  }

  @Post()
  async create(@Body() createDto: CreateHrActionDto): Promise<HrAction> {
    return this.hrActionsService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: CreateHrActionDto,
  ): Promise<HrAction> {
    const updatedAction = await this.hrActionsService.update(id, updateDto);
    if (!updatedAction) {
      throw new NotFoundException('HR action not found');
    }
    return updatedAction;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const action = await this.hrActionsService.findOne(id);
    if (!action) {
      throw new NotFoundException('HR action not found');
    }
    return this.hrActionsService.remove(id);
  }
}
