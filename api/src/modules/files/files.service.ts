import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  // Получение всех файлов
  async findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  // Создание нового файла
  async create(fileData: Partial<File>): Promise<File> {
    console.log('Creating new file with data:', fileData);
    const file = this.fileRepository.create({
      name: fileData.name,
      link: fileData.link,
    });
    return this.fileRepository.save(file);
  }

  // Обновление файла по ID
  async update(id: number, fileData: Partial<File>): Promise<File> {
    console.log(`Updating file with ID ${id}`, fileData);
    await this.fileRepository.update(id, fileData);
    const updatedFile = await this.fileRepository.findOne({ where: { id } });
    if (!updatedFile) {
      console.error(`File with ID ${id} not found`);
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    console.log(`File updated successfully`, updatedFile);
    return updatedFile;
  }

  // Удаление файла по ID
  async remove(id: number): Promise<void> {
    console.log(`Deleting file with ID ${id}`);
    const deleteResult = await this.fileRepository.delete(id);
    if (!deleteResult.affected) {
      console.error(`File with ID ${id} not found`);
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    console.log(`File deleted successfully`);
  }
}
