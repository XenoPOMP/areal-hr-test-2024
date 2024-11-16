import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly link?: string;

  @IsOptional()
  @IsInt()
  readonly employee_id?: number;
}
