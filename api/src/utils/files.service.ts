import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class FilesService {
  private readonly uploadPath = path.join(
    process.cwd(),
    'areal-hr-test-2024',
    'files',
  );

  async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!fs.existsSync(this.uploadPath)) {
        await fs.promises.mkdir(this.uploadPath, { recursive: true });
      }

      const filePath = path.join(this.uploadPath, file.filename);

      await writeFileAsync(filePath, file.buffer);

      return `/files/${file.filename}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Не удалось сохранить файл');
    }
  }
}
