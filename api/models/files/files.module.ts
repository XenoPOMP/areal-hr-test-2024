import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './file.model';
import { Employee } from '../employees/employee.model'; // Импорт модели сотрудника для связи

@Module({
  imports: [SequelizeModule.forFeature([File, Employee])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
