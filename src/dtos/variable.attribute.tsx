import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AttributeEnumType,
  DataEnumType,
  MutabilityEnumType,
} from '@citrineos/base';
import { Type } from 'class-transformer';
import { ComponentDto } from './component';
import { VariableDto } from './variable';
import { BaseDto } from './base';

export class VariableAttributeDto extends BaseDto {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsOptional()
  @IsEnum(AttributeEnumType)
  type?: AttributeEnumType | null;

  @IsEnum(DataEnumType)
  dataType!: DataEnumType;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsOptional()
  @IsEnum(MutabilityEnumType)
  mutability?: MutabilityEnumType | null;

  @IsBoolean()
  persistent!: boolean;

  @IsBoolean()
  constant!: boolean;

  @Type(() => VariableDto)
  @IsOptional()
  variableId?: VariableDto | null;

  @Type(() => ComponentDto)
  @IsOptional()
  componentId?: ComponentDto | null;

  @IsOptional()
  @IsNumber()
  evseDatabaseId?: number | null;

  @IsOptional()
  @IsString()
  generatedAt?: string;
}
