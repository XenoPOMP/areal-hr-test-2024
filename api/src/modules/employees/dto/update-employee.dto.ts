import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PassportDto {
  @IsString()
  serial: string;

  @IsString()
  number: string;

  @IsDate()
  @Type(() => Date)
  date_issue: Date;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  issued_by?: string;
}

class AddressDto {
  @IsString()
  region: string;

  @IsString()
  settlement: string;

  @IsString()
  street: string;

  @IsString()
  house: string;

  @IsString()
  @IsOptional()
  housing?: string;

  @IsString()
  @IsOptional()
  flat?: string;
}

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
  @Type(() => Date)
  date_birth?: Date;

  @IsOptional()
  @IsNumber()
  position_id?: number;

  @IsOptional()
  @Type(() => PassportDto)
  passport?: PassportDto;

  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;
}
