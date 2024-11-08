import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly department_id?: string; // Связь с департаментом
}