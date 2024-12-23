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
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { HistoryOfChangesService } from '../history_of_changes/history_of_changes.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import * as fs from 'node:fs';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deletedEmployee = await this.employeesService.softDeleteEmployee(
        id,
        userId,
      );

      return {
        message: 'Сотрудник, паспорт и адрес успешно удалены',
      };
    } catch (error) {
      console.error('Ошибка при мягком удалении сотрудника:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post(':id/upload-scan')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const employeeId = req.params.id;
          const uploadPath = path.join(
            process.cwd(),
            '..',
            'files',
            employeeId,
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Создана директория:', uploadPath);
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          console.log('Сгенерировано имя файла:', filename);
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Поступил запрос на загрузку файла:', { id, file });

    if (!file) {
      throw new NotFoundException('Файл не был загружен');
    }

    return {
      message: 'Файл успешно загружен',
      filePath: `/files/${id}/${file.filename}`,
    };
  }
}
