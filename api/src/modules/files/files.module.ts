import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from '@models/file.model';
import { Employee } from '@models/employee.model';
import { FileUploadController } from 'uploads/file_upload.controller';
import { FileUploadService } from 'uploads/file_upload.service';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [SequelizeModule.forFeature([File, Employee, HistoryOfChanges])],
  controllers: [FilesController, FileUploadController],
  providers: [FilesService, FileUploadService, HistoryOfChangesService],
  exports: [FilesService],
})
export class FilesModule {}
