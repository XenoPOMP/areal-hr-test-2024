import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly address?: string;
}
