import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  HttpException,
  HttpStatus,
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
    console.log('Received employee data:', employeeData);

    if (!employeeData.passportData || !employeeData.addressData) {
      throw new HttpException(
        {
          message: 'Passport or address data missing',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { passportData, addressData, ...employeeBaseData } = employeeData;

    return this.employeesService.createEmployee(
      employeeBaseData,
      passportData,
      addressData,
    );
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateData: UpdateEmployeeDto,
  ) {
    return await this.employeesService.update(id, updateData);
  }

  @Patch(':id/soft-delete')
  async softDeleteEmployee(@Param('id') id: number) {
    console.log(
      `Received PATCH request to soft-delete employee with ID: ${id}`,
    );
    try {
      await this.employeesService.softDeleteEmployee(id);
      return {
        message: 'Employee and related records soft-deleted successfully',
      };
    } catch (error) {
      console.error('Error in softDeleteEmployee:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
