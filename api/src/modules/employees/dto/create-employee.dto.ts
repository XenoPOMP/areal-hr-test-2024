import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  surname: string;

  @IsString()
  second_name: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  date_birth?: Date;

  @IsOptional()
  @IsInt()
  position_id?: number;
}
