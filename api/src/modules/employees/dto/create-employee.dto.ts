import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePassportDto } from './passports/create-passport.dto';
import { CreateAddressDto } from './addresses/create-address.dto';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly surname?: string;

  @IsString()
  @IsOptional()
  readonly second_name?: string;

  @IsDate()
  @IsOptional()
  readonly date_birth?: Date;

  @IsInt()
  @IsOptional()
  readonly passport_id?: number;

  @IsInt()
  @IsOptional()
  readonly address_id?: number;

  @IsInt()
  @IsOptional()
  readonly position_id?: number;

  @IsInt()
  @IsOptional()
  readonly file_id?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePassportDto)
  readonly passport?: CreatePassportDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  readonly address?: CreateAddressDto;
}
