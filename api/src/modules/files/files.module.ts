import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from '@models/file.model';
import { Employee } from '@models/employee.model'; // Импорт модели сотрудника для связи

@Module({
  imports: [SequelizeModule.forFeature([File, Employee])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
