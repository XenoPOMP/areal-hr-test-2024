import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePassportDto } from '../passports/create-passport.dto';
import { CreateAddressDto } from '../addresses/create-address.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Post()
  create(@Body() empData: CreateEmployeeDto): Promise<Employee> {
    console.log('Received data for creation:', empData);
    return this.employeesService.create(empData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() empData: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(id, empData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.employeesService.remove(id);
  }
}
