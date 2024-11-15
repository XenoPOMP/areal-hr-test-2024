import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;

  @IsOptional()
  @IsNumber()
  readonly parent_id?: number;

  @IsOptional()
  @IsNumber()
  readonly organisation_id?: number;
}
