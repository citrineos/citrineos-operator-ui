import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VariableAttributeDto } from './variable.attribute.dto';
import { BaseDto } from './base.dto';

export class EvseDto extends BaseDto {
  @IsNumber()
  databaseId!: number;

  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  connectorId?: number | null;

  /* @Type(() => CustomDataType)
  @IsOptional()
  customData: CustomDataType | null = null;
  */

  @IsArray()
  @Type(() => VariableAttributeDto)
  @ValidateNested({ each: true })
  VariableAttributes?: VariableAttributeDto[];
}
