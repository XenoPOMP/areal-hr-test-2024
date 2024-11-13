import { IsString } from 'class-validator';
export class UpdateDepartmentDto {
  @IsString()
  readonly name?: string;
  @IsString()
  readonly organization_id?: string;
}
