import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly organizationId?: string; // Связь с организацией
}