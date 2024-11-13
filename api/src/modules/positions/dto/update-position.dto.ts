import { IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly department_id?: string;
}
