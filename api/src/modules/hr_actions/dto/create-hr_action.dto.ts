import { IsString, IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHrActionDto {
  @IsString()
  readonly action_type: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  @IsDate()
  readonly date: Date;

  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  @IsNumber()
  readonly salary: number;

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  employee_id: number;

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  department_id: number;

  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  position_id: number;
}
