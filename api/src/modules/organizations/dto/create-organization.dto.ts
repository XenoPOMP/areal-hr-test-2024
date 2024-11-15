import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;
}
