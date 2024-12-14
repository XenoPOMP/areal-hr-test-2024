import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '@models/file.model';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
    private readonly historyOfChangesService: HistoryOfChangesService, // Внедряем сервис логирования
  ) {}

  async findAll(): Promise<File[]> {
    return this.fileModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(id: number): Promise<File | null> {
    return this.fileModel.findByPk(id);
  }

  async create(dto: CreateFileDto, userId: number): Promise<File> {
    const file = await this.fileModel.create({ ...dto });

    // Логирование изменения на стороне бэкенда
    await this.historyOfChangesService.logChange(
      'file',
      file,
      userId, // Используем user_id из сессии
    );

    return file;
  }

  async update(
    id: number,
    dto: UpdateFileDto,
    userId: number,
  ): Promise<File | null> {
    const file = await this.fileModel.findByPk(id);
    if (file) {
      const updatedFile = await file.update({ ...dto });

      // Логирование изменения на стороне бэкенда
      await this.historyOfChangesService.logChange(
        'file',
        updatedFile,
        userId, // Используем user_id из сессии
      );

      return updatedFile;
    }
    return null;
  }

  async softDeleteFile(id: number, userId: number): Promise<void> {
    const file = await File.findByPk(id);

    if (!file) {
      throw new Error('File not found');
    }

    file.deleted_at = new Date();
    await file.save();

    // Логирование удаления на стороне бэкенда
    await this.historyOfChangesService.logChange(
      'file',
      { id, deleted_at: new Date() }, // Данные для логирования
      userId, // Используем user_id из сессии
    );
  }
}
