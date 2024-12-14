import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from '@models/file.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';
import { Request } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly historyOfChangesService: HistoryOfChangesService, // Внедряем сервис логирования
  ) {}

  @Get()
  async findAll(): Promise<File[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<File> {
    const file = await this.filesService.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  @Post()
  async create(
    @Body() createFileDto: CreateFileDto,
    @Req() req: Request, // Получаем доступ к сессии
  ): Promise<File> {
    // Извлекаем user_id из сессии через req.session.user.id
    const userId = req.session?.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const file = await this.filesService.create(createFileDto, userId);

    return file;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req: Request, // Получаем доступ к сессии
  ): Promise<File> {
    // Извлекаем user_id из сессии через req.session.user.id
    const userId = req.session?.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updatedFile = await this.filesService.update(
      id,
      updateFileDto,
      userId,
    );
    if (!updatedFile) {
      throw new NotFoundException('File not found');
    }

    return updatedFile;
  }

  @Patch(':id/soft-delete')
  async softDeleteFile(
    @Param('id') id: number,
    @Req() req: Request, // Получаем доступ к сессии
  ) {
    // Извлекаем user_id из сессии через req.session.user.id
    const userId = req.session?.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    await this.filesService.softDeleteFile(id, userId);
    return;
  }
}
