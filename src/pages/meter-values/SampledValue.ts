import {
  OCPP2_0_1
} from '@citrineos/base';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignedMeterValue {
  @IsString()
  signedMeterData!: string;

  @IsString()
  signingMethod!: string;

  @IsString()
  encodingMethod!: string;

  @IsString()
  publicKey!: string;

  // customData?: CustomDataType | null; // todo: handle custom data
}

export class UnitOfMeasure {
  @IsString()
  @IsOptional()
  unit?: string | null;

  @IsNumber()
  @IsOptional()
  multiplier?: number | null;

  // customData?: CustomDataType | null; // todo: handle custom data
}

export enum SampledValueProps {
  value = 'value',
  context = 'context',
  measurand = 'measurand',
  phase = 'phase',
  location = 'location',
  signedMeterValue = 'signedMeterValue',
  unitOfMeasure = 'unitOfMeasure',
}
export class SampledValue {
  @IsNumber()
  value!: number;

  @IsEnum(OCPP2_0_1.ReadingContextEnumType)
  @IsOptional()
  context?: OCPP2_0_1.ReadingContextEnumType | null;

  @IsEnum(OCPP2_0_1.MeasurandEnumType)
  @IsOptional()
  measurand?: OCPP2_0_1.MeasurandEnumType | null;

  @IsEnum(OCPP2_0_1.PhaseEnumType)
  @IsOptional()
  phase?: OCPP2_0_1.PhaseEnumType | null;

  @IsEnum(OCPP2_0_1.LocationEnumType)
  @IsOptional()
  location?: OCPP2_0_1.LocationEnumType | null;

  @Type(() => SignedMeterValue)
  @IsOptional()
  @ValidateNested()
  signedMeterValue?: SignedMeterValue | null;

  @Type(() => UnitOfMeasure)
  @IsOptional()
  @ValidateNested()
  unitOfMeasure?: UnitOfMeasure | null;

  // customData?: CustomDataType | null; // todo: handle custom data
}
