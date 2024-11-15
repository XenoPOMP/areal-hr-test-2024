import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  region: string;

  @IsString()
  settlement: string;

  @IsString()
  street: string;

  @IsString()
  house: string;

  @IsOptional()
  @IsString()
  housing?: string;

  @IsOptional()
  @IsString()
  flat?: string;

  @IsInt()
  employee_id: number; // Обязательно передаем ID сотрудника
}
