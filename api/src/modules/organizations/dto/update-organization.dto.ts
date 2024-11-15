import { IsString, IsOptional } from 'class-validator';

export class UpdateOrganisationDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;
}
