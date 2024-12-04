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
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    const filePath = path.join(__dirname, '../../uploads', fileName);

    fs.writeFileSync(filePath, file.buffer);

    const newFile = await this.fileModel.create({
      name: file.originalname,
      link: filePath,
      employee_id,
      deleted_at: null,
    });

    return newFile.link;
  }
}
