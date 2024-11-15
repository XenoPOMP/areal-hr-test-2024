import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  second_name?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDate()
  date_birth?: Date;

  @IsOptional()
  @IsInt()
  position_id?: number;
}
