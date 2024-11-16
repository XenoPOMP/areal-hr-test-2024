import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreateHrActionDto {
  @IsString()
  readonly action_type: string;

  @IsDate()
  readonly date: Date;

  @IsNumber()
  readonly employee_id: number;

  @IsNumber()
  readonly department_id: number;

  @IsNumber()
  readonly position_id: number;

  @IsNumber()
  readonly salary: number;
}
