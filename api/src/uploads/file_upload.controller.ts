import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file_upload.service';

@Controller('uploads')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('employee_id') employee_id: number,
  ) {
    if (!file) {
      throw new BadRequestException('Файл обязателен');
    }

    if (!employee_id) {
      throw new BadRequestException('ID сотрудника обязателен');
    }

    const filePath = await this.fileUploadService.uploadFile(file, employee_id);
    return { message: 'Файл успешно загружен', filePath };
  }
}
