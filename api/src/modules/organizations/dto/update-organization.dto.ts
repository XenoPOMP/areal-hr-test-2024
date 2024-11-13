import { IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  readonly name?: string;

  @IsString()
  readonly address?: string;
}
