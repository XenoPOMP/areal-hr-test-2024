import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePassportDto {
  @IsString()
  serial: string;

  @IsString()
  number: string;

  @IsDateString()
  date_issue: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  issued_by: string;
}
