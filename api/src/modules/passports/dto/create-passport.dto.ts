import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePassportDto {
  @IsString()
  @IsNotEmpty()
  readonly serial: string;

  @IsString()
  @IsNotEmpty()
  readonly number: string;

  @IsDateString()
  @IsNotEmpty()
  readonly date_issue: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsString()
  @IsNotEmpty()
  readonly issued_by: string;
}
