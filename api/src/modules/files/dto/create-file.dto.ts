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
  employee_id?: number;
}
