import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { upload, FileRepository } from './file_upload.service'; // Импортируем уже настроенный multer

@Controller('employee')
export class EmployeeController {
  constructor(private readonly fileRepository: FileRepository) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', { storage: upload }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { employee_id: number },
  ) {
    const filePath = `/uploads/employee_images/${file.filename}`;

    // Сохраняем ссылку на изображение в базе данных
    await this.fileRepository.save({
      name: file.filename,
      link: filePath,
      employee_id: body.employee_id, // Связываем изображение с сотрудником
    });

    return { message: 'Image uploaded successfully', filePath };
  }
}
