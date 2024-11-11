import { IsString, IsOptional } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly link?: string;
}