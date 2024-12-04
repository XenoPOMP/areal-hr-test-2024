import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'uploads/file_upload.service';

@Controller('uploads')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('employee_id') employee_id: number,
  ) {
    if (!employee_id) {
      throw new Error('Employee ID is required');
    }

    const filePath = await this.fileUploadService.uploadFile(file, employee_id);
    return { filePath };
  }
}
