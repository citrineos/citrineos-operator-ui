import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '../../util/TransformDate';
import { SampledValue } from './SampledValue';
import { BaseModel } from '../../util/BaseModel';

export class MeterValue extends BaseModel {
  @IsInt()
  id!: number;

  @IsInt()
  @IsOptional()
  transactionEventId?: number | null;

  @IsInt()
  @IsOptional()
  transactionDatabaseId?: number | null;

  @IsArray()
  @Type(() => SampledValue)
  @ValidateNested({ each: true })
  sampledValue!: [SampledValue, ...SampledValue[]];

  @TransformDate()
  timestamp!: Date;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}
