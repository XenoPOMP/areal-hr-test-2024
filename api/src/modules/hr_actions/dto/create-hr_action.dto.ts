import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreateHrActionDto {
  @IsString()
  readonly action_type: string;

  @IsDate()
  readonly date: Date;

  @IsNumber()
  employee_id: number;

  @IsNumber()
  department_id: number;

  @IsNumber()
  position_id: number;

  @IsNumber()
  readonly salary: number;
}
