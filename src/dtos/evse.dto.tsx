import { IsNumber, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export enum EvseDtoProps {
  databaseId = 'databaseId',
  id = 'id',
  connectorId = 'connectorId',
}

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
}
