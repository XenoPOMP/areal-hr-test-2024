import { Injectable } from '@nestjs/common';
import { File } from '@models/file.model';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from '@models/employee.model';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(File) private readonly fileModel: typeof File,
    @InjectModel(Employee) private readonly employeeModel: typeof Employee,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    employee_id: number,
  ): Promise<string> {
    // Проверка существования сотрудника
    const employee = await this.employeeModel.findByPk(employee_id);
    if (!employee) {
      throw new Error('Сотрудник не найден');
    }

    // Указание директории для загрузки файлов
    const uploadDir = path.join('files', String(employee_id));
    console.log('Upload directory:', uploadDir);

    const absoluteDir = path.join(__dirname, '../../../', uploadDir);

    if (!fs.existsSync(absoluteDir)) {
      fs.mkdirSync(absoluteDir, { recursive: true });
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const relativePath = path.join(uploadDir, fileName); // относительный путь
    const absolutePath = path.join(absoluteDir, fileName); // абсолютный путь

    // Сохраняем файл
    fs.writeFileSync(absolutePath, file.buffer);

    // Сохранение данных о файле в БД
    const newFile = await this.fileModel.create({
      name: file.originalname,
      link: `/${relativePath.replace(/\\/g, '/')}`, // относительный путь для сохранения
      employee_id,
      deleted_at: null,
    });

    return newFile.link;
  }
}
