import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  settlement?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  house?: string;

  @IsString()
  @IsOptional()
  housing?: string;

  @IsString()
  @IsOptional()
  flat?: string;
}
