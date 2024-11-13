import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';

export class CreateHrActionDto {
  @IsString()
  @IsNotEmpty()
  readonly action_type: string;

  @IsDate()
  @IsOptional()
  readonly date?: Date;

  @IsInt()
  @IsNotEmpty()
  readonly employee_id: number;

  @IsInt()
  @IsOptional()
  readonly department_id?: number;

  @IsInt()
  @IsOptional()
  readonly position_id?: number;
}
