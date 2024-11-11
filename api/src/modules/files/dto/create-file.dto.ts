import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string; // Название файла

  @IsString()
  @IsNotEmpty()
  readonly link: string; // Ссылка на файл
}