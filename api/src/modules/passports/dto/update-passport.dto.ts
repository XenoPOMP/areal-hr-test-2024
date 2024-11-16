import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdatePassportDto {
  @IsOptional()
  @IsString()
  readonly serial?: string;

  @IsOptional()
  @IsString()
  readonly number?: string;

  @IsOptional()
  @IsDateString()
  readonly date_issue?: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @IsString()
  readonly issued_by?: string;
}
