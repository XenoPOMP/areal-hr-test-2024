import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from '@models/file.model';
import { Employee } from '@models/employee.model';
import { FileUploadController } from 'uploads/file_upload.controller';
import { FileUploadService } from 'uploads/file_upload.service';

@Module({
  imports: [SequelizeModule.forFeature([File, Employee])],
  controllers: [FilesController, FileUploadController],
  providers: [FilesService, FileUploadService],
  exports: [FilesService],
})
export class FilesModule {}
