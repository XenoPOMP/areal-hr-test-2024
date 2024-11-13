import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { File } from './file.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Получение всех файлов
  @Get()
  findAll(): Promise<File[]> {
    return this.filesService.findAll();
  }

  // Создание нового файла
  @Post()
  create(@Body() fileData: Partial<File>): Promise<File> {
    console.log('Received data for file creation:', fileData);
    return this.filesService.create(fileData);
  }

  // Обновление файла по ID
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() fileData: Partial<File>,
  ): Promise<File> {
    return this.filesService.update(id, fileData);
  }

  // Удаление файла по ID
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.filesService.remove(id);
  }
}
