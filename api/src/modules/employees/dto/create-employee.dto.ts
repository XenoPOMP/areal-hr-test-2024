import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  surname: string;

  @IsString()
  second_name: string;

  @IsString()
  name: string;

  @IsString()
  date_birth: string;

  @IsNumber()
  position_id: number;

  @IsNumber()
  passport_id: number;

  @IsNumber()
  address_id: number;

  @ValidateNested()
  @Type(() => PassportDataDto)
  passport: PassportDataDto;

  @ValidateNested()
  @Type(() => AddressDataDto)
  address: AddressDataDto;
}

export class PassportDataDto {
  id?: number;

  @IsString()
  serial: string;

  @IsString()
  number: string;

  @IsString()
  date_issue: string;

  @IsString()
  code: string;

  @IsString()
  issued_by: string;
}

export class AddressDataDto {
  id?: number;

  @IsString()
  region: string;

  @IsString()
  settlement: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  house: string;

  @IsOptional()
  @IsString()
  housing: string;

  @IsOptional()
  @IsString()
  flat: string;
}
