import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import multer from 'multer';
import * as path from 'node:path';
import { File } from 'src/models/file.model';

// Репозиторий для работы с файлами
@Injectable()
export class FileRepository {
  constructor(@InjectModel(File) private fileModel: typeof File) {}

  async save(fileData: any) {
    return this.fileModel.create(fileData);
  }
}

// Конфигурация для Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/employee_images'); // Папка для хранения
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Получаем расширение файла
    const filename = `employee_${Date.now()}${ext}`; // Генерируем уникальное имя
    cb(null, filename); // Устанавливаем имя файла
  },
});

// Создайте экземпляр multer с настройками
export const upload = multer({ storage });
