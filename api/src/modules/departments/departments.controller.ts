import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from '@models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Post()
  async create(
    @Body() dto: CreateDepartmentDto,
    @Session() session: any,
  ): Promise<Department> {
    const user_id = session.user?.id;

    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return this.departmentsService.create(dto, user_id);
  }

  @Put(':id')
  async updateDepartment(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
    @Session() session: any,
  ): Promise<Department | null> {
    const user_id = session.user?.id; // Извлекаем id из сессии
    console.log('ID пользователя из сессии:', user_id);

    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован.');
    }

    return this.departmentsService.update(id, dto, user_id);
  }

  @Patch(':id/soft-delete')
  async softDeleteDepartment(
    @Param('id') id: number,
    @Session() session: any,
  ): Promise<void> {
    const user_id = session.user?.id;
    console.log('Удаление отдела. user_id:', user_id, 'departmentId:', id);

    if (!user_id) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    await this.departmentsService.softDeleteDepartment(id, user_id);
  }
}
