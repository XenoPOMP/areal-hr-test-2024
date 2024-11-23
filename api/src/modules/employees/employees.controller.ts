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
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id/details')
  async getEmployeeDetails(@Param('id') id: string) {
    return this.employeesService.getEmployeeWithDetails(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  async createEmployee(@Body() employeeData: any) {
    const { passportData, addressData, ...employeeBaseData } = employeeData;

    return this.employeesService.createEmployee(
      employeeBaseData,
      passportData,
      addressData,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.employeesService.remove(id);
  }
}
