import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

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
