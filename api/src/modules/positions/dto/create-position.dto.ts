import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly departmentId?: string; // Связь с департаментом
}