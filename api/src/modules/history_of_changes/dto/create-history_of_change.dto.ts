import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CreateHistoryOfChangesDto {
  @IsDate()
  @IsOptional()
  readonly date?: Date;

  @IsString()
  @IsOptional()
  readonly time?: string;

  @IsString()
  @IsOptional()
  readonly login?: string;

  @IsString()
  @IsOptional()
  readonly object?: string;

  @IsInt()
  @IsOptional()
  readonly user_id?: number;

  @IsOptional()
  readonly field?: any; // Должно соответствовать типу JSON
}