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
  Req,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { HistoryOfChangesService } from '../history_of_changes/history_of_changes.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly historyOfChangesService: HistoryOfChangesService,
  ) {}

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

  @Get(':id/files')
  async getEmployeeFiles(@Param('id') id: number) {
    return this.employeesService.getEmployeeFiles(id);
  }

  @Post()
  async createEmployee(@Body() employeeData: any, @Req() req: any) {
    console.log('Получены данные для создания сотрудника:', employeeData);

    const userId = req.session?.user?.id;
    if (!userId) {
      console.error('userId отсутствует:', req.session);
      throw new HttpException('user_id отсутствует', HttpStatus.BAD_REQUEST);
    }

    if (!employeeData.passportData || !employeeData.addressData) {
      throw new HttpException(
        { message: 'Отсутствуют данные паспорта или адреса' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { passportData, addressData, ...employeeBaseData } = employeeData;

    try {
      // Создание сотрудника в сервисе
      const createdEmployee = await this.employeesService.createEmployee(
        employeeBaseData,
        passportData,
        addressData,
        userId,
      );

      return createdEmployee;
    } catch (error) {
      console.error('Ошибка при создании сотрудника:', error);
      throw new HttpException(
        'Не удалось создать сотрудника',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateData: UpdateEmployeeDto,
    @Req() req: any,
  ) {
    console.log('Получены данные для обновления:', updateData);
    console.log('Сессия:', req.session);

    const userId = req.session?.user?.id;
    if (!userId) {
      console.error('userId отсутствует:', req.session);
      throw new HttpException('user_id отсутствует', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedEmployee = await this.employeesService.update(
        id,
        updateData,
        userId,
      );

      return updatedEmployee;
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error);
      throw new HttpException(
        'Не удалось обновить сотрудника',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/soft-delete')
  async softDeleteEmployee(@Param('id') id: number, @Req() req: any) {
    console.log(`Получен запрос на мягкое удаление сотрудника с ID: ${id}`);

    const userId = req.session?.user?.id;
    if (!userId) {
      console.error('userId отсутствует:', req.session);
      throw new HttpException('user_id отсутствует', HttpStatus.BAD_REQUEST);
    }

    try {
      const deletedEmployee = await this.employeesService.softDeleteEmployee(
        id,
        userId,
      );

      // Логирование изменений
      await this.historyOfChangesService.logChange(
        'employee'.toLowerCase(),
        deletedEmployee,
        userId,
      );

      return {
        message: 'Сотрудник и связанные записи успешно удалены',
      };
    } catch (error) {
      console.error('Ошибка при мягком удалении сотрудника:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
