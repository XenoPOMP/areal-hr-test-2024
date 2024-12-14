import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { HrActionsService } from './hr_actions.service';
import { CreateHrActionDto } from './dto/create-hr_action.dto';
import { HrAction } from '@models/hr_action.model';
import { EmployeesService } from 'modules/employees/employees.service';
import { DepartmentsService } from 'modules/departments/departments.service';
import { PositionsService } from 'modules/positions/positions.service';
import { Request } from 'express';

@Controller('hr_actions')
export class HrActionsController {
  constructor(
    private readonly hrActionsService: HrActionsService,
    private readonly employeesService: EmployeesService,
    private readonly departmentsService: DepartmentsService,
    private readonly positionsService: PositionsService,
  ) {}

  @Get('employees')
  async getEmployees() {
    return await this.employeesService.findAll();
  }

  @Get('departments')
  async getDepartments() {
    return await this.departmentsService.findAll();
  }

  @Get('positions')
  async getPositions() {
    return await this.positionsService.findAll();
  }

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
  async create(
    @Body() createDto: CreateHrActionDto,
    @Req() req: Request, // Для логирования
  ): Promise<HrAction> {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.hrActionsService.create(createDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: CreateHrActionDto,
    @Req() req: Request, // Для логирования
  ): Promise<HrAction> {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const updatedAction = await this.hrActionsService.update(
      id,
      updateDto,
      userId,
    );
    if (!updatedAction) {
      throw new NotFoundException('HR action not found');
    }
    return updatedAction;
  }

  @Patch(':id/soft-delete')
  async softDeleteHrAction(@Param('id') id: number, @Req() req: Request) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    await this.hrActionsService.softDeleteHrAction(id, userId);
    return;
  }
}
