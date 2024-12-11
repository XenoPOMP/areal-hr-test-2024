import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DepartmentsService } from './departments.service';
import { Department } from '@models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { User } from 'src/models/user.model';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Post()
  create(
    @Body() dto: CreateDepartmentDto,
    @Req() req: Request & { user?: User },
  ): Promise<Department> {
    const userId = req.user?.id;
    return this.departmentsService.create(dto, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: Request & { user?: User },
  ): Promise<Department | null> {
    const userId = req.user?.id;
    return this.departmentsService.update(id, dto, userId);
  }

  @Patch(':id/soft-delete')
  async softDeleteDepartment(
    @Param('id') id: number,
    @Req() req: Request & { user?: User },
  ) {
    const userId = req.user?.id;
    await this.departmentsService.softDeleteDepartment(id, userId);
    return;
  }
}
