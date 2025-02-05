import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base';

export class VariableDto extends BaseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  instance?: string | null;
}
