import { IsString, IsDate, IsOptional, IsInt } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  second_name?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDate()
  date_birth?: Date;

  @IsOptional()
  @IsInt()
  position_id?: number;

  @IsOptional()
  passport?: PassportDto;

  @IsOptional()
  address?: AddressDto;
}

class PassportDto {
  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsDate()
  date_issue?: Date;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  issued_by?: string;
}

class AddressDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  settlement?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  house?: string;

  @IsOptional()
  @IsString()
  housing?: string;

  @IsOptional()
  @IsString()
  flat?: string;
}
