import { IsString, IsOptional, IsDate, IsJSON } from 'class-validator';

export class CreateHistoryOfChangeDto {
  @IsString()
  @IsOptional()
  readonly object?: string;

  @IsJSON()
  @IsOptional()
  readonly field?: JSON;

  @IsDate()
  @IsOptional()
  readonly date?: Date;

  @IsOptional()
  readonly user_id?: number; // Foreign key to User
}
