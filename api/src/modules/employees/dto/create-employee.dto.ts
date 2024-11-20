import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  surname: string;

  @IsString()
  @IsOptional()
  second_name?: string;

  @IsString()
  name: string;

  @IsDate()
  date_birth: Date; // Используем Date для даты рождения

  @IsNumber()
  position_id: number;

  @IsOptional()
  passport?: PassportDto;

  @IsOptional()
  address?: AddressDto;
}

class PassportDto {
  @IsString()
  serial: string;

  @IsString()
  number: string;

  @IsDate()
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
