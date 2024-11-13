import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Post()
  create(@Body() depData: Partial<Department>): Promise<Department> {
    console.log('Received data for creation:', depData);
    return this.departmentsService.create(depData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() depData: Partial<Department>,
  ): Promise<Department> {
    return this.departmentsService.update(id, depData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
