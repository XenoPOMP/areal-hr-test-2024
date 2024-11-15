import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class UpdateHrActionDto {
  @IsOptional()
  @IsString()
  readonly action_type?: string;

  @IsOptional()
  @IsDate()
  readonly date?: Date;

  @IsOptional()
  @IsNumber()
  readonly employee_id?: number;

  @IsOptional()
  @IsNumber()
  readonly department_id?: number;

  @IsOptional()
  @IsNumber()
  readonly position_id?: number;
}
