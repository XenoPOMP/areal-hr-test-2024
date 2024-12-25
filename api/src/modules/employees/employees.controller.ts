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
  Res,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { HistoryOfChangesService } from '../history_of_changes/history_of_changes.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Response } from 'express';

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
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.session?.user?.id;
    if (!userId) {
      console.error('userId отсутствует:', req.session);
      throw new HttpException('user_id отсутствует', HttpStatus.BAD_REQUEST);
    }

    try {
      const fileRecord = await this.employeesService.uploadEmployeeScan(
        id,
        file,
        userId,
      );

      await this.historyOfChangesService.logChange(
        'scan',
        { action: 'upload', employee_id: id, file: fileRecord },
        userId,
      );

      return {
        message: 'Файл успешно загружен',
        file: fileRecord,
      };
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      throw new HttpException(
        'Не удалось загрузить файл',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('files/:fileId')
  async softDeleteEmployeeFile(
    @Param('fileId') fileId: number,
    @Req() req: any,
  ) {
    const userId = req.session?.user?.id;
    if (!userId) {
      console.error('userId отсутствует:', req.session);
      throw new HttpException('user_id отсутствует', HttpStatus.BAD_REQUEST);
    }

    try {
      const fileRecord = await this.employeesService.findEmployeeFile(fileId);

      if (!fileRecord) {
        throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
      }

      if (fileRecord.deleted_at) {
        throw new HttpException('Файл уже был удалён', HttpStatus.NOT_FOUND);
      }

      const filePath = path.join(
        process.cwd(),
        '..',
        'files',
        String(fileRecord.employee_id),
        path.basename(fileRecord.link),
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`Файл ${filePath} не найден в файловой системе.`);
      }

      await this.employeesService.softDeleteFile(fileId, userId);

      await this.historyOfChangesService.logChange(
        'scan',
        { action: 'delete', file_id: fileId },
        userId,
      );

      return {
        message: 'Файл успешно удалён',
      };
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
      throw new HttpException(
        'Не удалось удалить файл',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('files/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response) {
    const file = await this.employeesService.findEmployeeFile(fileId);

    if (!file) {
      throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
    }

    const filePath = path.join(
      process.cwd(),
      '..',
      'files',
      String(file.employee_id),
      path.basename(file.link),
    );

    if (!fs.existsSync(filePath)) {
      throw new HttpException('Файл не найден в системе', HttpStatus.NOT_FOUND);
    }

    res.download(filePath, file.name, (err: Error | null) => {
      if (err) {
        console.error('Ошибка скачивания файла:', err);
        throw new HttpException(
          'Ошибка скачивания файла',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
