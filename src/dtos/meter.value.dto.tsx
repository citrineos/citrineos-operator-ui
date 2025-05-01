import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Sortable } from '@util/decorators/Sortable';
import { Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { BaseDto } from './base.dto';
import { SampledValueDto } from './sampled.value.dto';
import { MeasurandEnumType, ReadingContextEnumType } from '@OCPP2_0_1';

export enum MeterValueDtoProps {
  id = 'id',
  transactionEventId = 'transactionEventId',
  transactionDatabaseId = 'transactionDatabaseId',
  sampledValue = 'sampledValue',
  timestamp = 'timestamp',
}

export class MeterValueDto extends BaseDto {
  @IsInt()
  id!: number;

  @IsInt()
  @IsOptional()
  transactionEventId?: number | null;

  @IsInt()
  @IsOptional()
  transactionDatabaseId?: number | null;

  @IsArray()
  @Type(() => SampledValueDto)
  @ValidateNested({ each: true })
  sampledValue!: SampledValueDto[];

  @Sortable()
  @TransformDate()
  timestamp!: Date;

  @IsInt()
  @IsOptional()
  connectorId?: number | null;

  // todo: handle custom data
  // customData?: CustomDataType | null;
}

// todo share below code with @citrineos/base
const TWO_HOURS = 60 * 60 * 2;

const validContexts = new Set([
  ReadingContextEnumType.Transaction_Begin,
  ReadingContextEnumType.Sample_Periodic,
  ReadingContextEnumType.Transaction_End,
]);

export const getTimestampToMeasurandArray = (
  sortedMeterValues: MeterValueDto[],
  measurand: MeasurandEnumType,
  validContextsArg: Set<ReadingContextEnumType>,
): [number, string][] => {
  if (sortedMeterValues.length === 0) return [];

  const baseTime = sortedMeterValues[0].timestamp;
  const result: [number, string][] = [];

  for (const meterValue of sortedMeterValues) {
    if (
      !meterValue.sampledValue[0].context ||
      validContextsArg.has(meterValue.sampledValue[0].context)
    ) {
      const overallValue = findOverallValue(meterValue.sampledValue, measurand);
      if (overallValue) {
        const timestampEpoch = meterValue.timestamp;
        // @ts-expect-error timestamp is moment object
        const elapsedTime = (timestampEpoch - baseTime) / 1000;
        if (elapsedTime > TWO_HOURS) {
          // skip weird data // todo is needed?
          continue;
        }
        const normalizedValue = normalizeToKwh(overallValue);
        if (normalizedValue !== null) {
          result.push([elapsedTime, normalizedValue]);
        }
      }
    }
  }

  return result;
};

export const findOverallValue = (
  sampledValues: SampledValueDto[],
  measurand: MeasurandEnumType,
): SampledValueDto | undefined => {
  return sampledValues.find((sv) => !sv.phase && sv.measurand === measurand);
};

export const normalizeToKwh = (
  overallValue: SampledValueDto,
): string | null => {
  let powerOfTen = overallValue.unitOfMeasure?.multiplier ?? 0;
  const unit = overallValue.unitOfMeasure?.unit?.toUpperCase();
  switch (unit) {
    case 'KWH':
      break;
    case 'WH':
    case 'W':
    case undefined:
      powerOfTen -= 3;
      break;
    case 'PERCENT':
      powerOfTen -= 2;
      break;
    default:
      throw new Error(
        `Unknown unit for measurand ${overallValue.measurand} unit ${unit} `,
      );
  }

  return (overallValue.value * 10 ** powerOfTen).toFixed(2);
};
