import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload, FileRepository } from './file_upload.service'; // Импортируем уже настроенный multer
import * as fs from 'fs';
import * as path from 'path';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly fileRepository: FileRepository) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', { storage: upload }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { employee_id: number },
  ) {
    if (!body.employee_id) {
      throw new Error('Employee ID is required');
    }

    // Путь и логика сохранения изображения
    const employeeFolder = path.join(
      __dirname,
      '..',
      '..',
      'files',
      body.employee_id.toString(),
    );
    if (!fs.existsSync(employeeFolder)) {
      fs.mkdirSync(employeeFolder, { recursive: true });
    }
    const filePath = path.join(employeeFolder, file.filename);
    fs.renameSync(file.path, filePath);

    // Сохраняем в базу данных
    await this.fileRepository.save({
      name: file.filename,
      link: `/files/${body.employee_id}/${file.filename}`,
      employee_id: body.employee_id,
    });

    return { message: 'Image uploaded successfully', filePath };
  }
}
