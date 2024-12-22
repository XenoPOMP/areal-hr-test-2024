import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(
            process.cwd(),
            'areal-hr-test-2024',
            'files',
          );
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4(); // Генерация уникального суффикса
          const fileExtension = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true); // Разрешаем файл
        } else {
          cb(new BadRequestException('Недопустимый тип файла'), false); // Отклоняем неподдерживаемые типы файлов
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // Ограничение размера файла 50MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }

    try {
      console.log('Получен файл:', file); // Логируем полученный файл для диагностики
      const filePath = await this.filesService.saveFile(file);
      return { filePath };
    } catch (error) {
      console.error('Ошибка при сохранении файла:', error); // Логируем ошибку
      throw new InternalServerErrorException('Не удалось сохранить файл');
    }
  }
}
