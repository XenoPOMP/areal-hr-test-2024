import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly link: string;

  @IsOptional()
  @IsInt()
  readonly employee_id?: number; // Связь с сотрудником
}
