import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';

export class UpdateHrActionDto {
  @IsString()
  @IsOptional()
  readonly action_type?: string;

  @IsDate()
  @IsOptional()
  readonly date?: Date;

  @IsInt()
  @IsOptional()
  readonly employee_id?: number;

  @IsInt()
  @IsOptional()
  readonly department_id?: number;

  @IsInt()
  @IsOptional()
  readonly position_id?: number;
}
