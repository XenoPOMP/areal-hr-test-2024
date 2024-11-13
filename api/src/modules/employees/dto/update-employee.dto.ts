import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly surname?: string;

  @IsString()
  @IsOptional()
  readonly second_name?: string;

  @IsDate()
  @IsOptional()
  readonly date_birth?: Date;

  @IsInt()
  @IsOptional()
  readonly passport_id?: number;

  @IsInt()
  @IsOptional()
  readonly address_id?: number;

  @IsInt()
  @IsOptional()
  readonly position_id?: number;

  @IsInt()
  @IsOptional()
  readonly file_id?: number;
}
