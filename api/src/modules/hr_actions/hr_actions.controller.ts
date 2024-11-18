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
import { EmployeesService } from 'modules/employees/employees.service';
import { DepartmentsService } from 'modules/departments/departments.service';
import { PositionsService } from 'modules/positions/positions.service';

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

  // Получение списка департаментов
  @Get('departments')
  async getDepartments() {
    return await this.departmentsService.findAll();
  }

  // Получение списка должностей
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
