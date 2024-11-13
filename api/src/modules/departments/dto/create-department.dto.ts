import { IsString, IsNotEmpty } from 'class-validator';
export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  readonly organization_id?: string; // Связь с организацией
}
