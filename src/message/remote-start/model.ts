import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  ChargingProfileKindEnumType,
  ChargingProfilePurposeEnumType,
  ChargingRateUnitEnumType,
  IdTokenEnumType,
  RecurrencyKindEnumType,
} from '@citrineos/base';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { TransformDate } from '../../util/TransformDate';
import { Dayjs } from 'dayjs';

export class IdTokenType {
  @IsString()
  @MinLength(1)
  idToken!: string;

  @IsEnum(IdTokenEnumType)
  type!: IdTokenEnumType;
}

export class ChargingSchedulePeriodType {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null = null;

  @IsInt()
  @IsPositive()
  startPeriod!: number;

  @IsNumber()
  @IsPositive()
  limit!: number;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  numberPhases?: number | null = null;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  phaseToUse?: number | null = null;
}

export class ChargingScheduleType {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null = null;

  @IsInt()
  @IsPositive()
  id!: number;

  @Type(() => Date)
  @TransformDate()
  @IsOptional()
  startSchedule?: Dayjs | null = null;

  @IsInt()
  @IsOptional()
  duration?: number | null = null;

  @IsEnum(ChargingRateUnitEnumType)
  chargingRateUnit!: ChargingRateUnitEnumType;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ChargingSchedulePeriodType)
  chargingSchedulePeriod!: ChargingSchedulePeriodType[];

  @IsNumber()
  @IsOptional()
  minChargingRate?: number | null = null;
}

export enum RemoteStartChargingProfilePurpose {
  TxProfile = ChargingProfilePurposeEnumType.TxProfile,
}

export class ChargingProfileType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null = null;

  @IsInt()
  stackLevel!: number;

  @IsEnum(RemoteStartChargingProfilePurpose)
  chargingProfilePurpose!: RemoteStartChargingProfilePurpose;

  @IsEnum(ChargingProfileKindEnumType)
  chargingProfileKind!: ChargingProfileKindEnumType;

  @IsOptional()
  @IsEnum(RecurrencyKindEnumType)
  recurrencyKind?: RecurrencyKindEnumType | null = null;

  @IsOptional()
  @Type(() => Date)
  @TransformDate()
  validFrom?: Dayjs | null = null;

  @IsOptional()
  @Type(() => Date)
  @TransformDate()
  validTo?: Dayjs | null = null;

  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested()
  @Type(() => ChargingScheduleType)
  chargingSchedule!: ChargingScheduleType[];
}

export class RequestStartTransactionRequest {
  @IsDefined()
  @ValidateNested()
  @Type(() => IdTokenType)
  idToken!: IdTokenType;

  @IsOptional()
  @IsInt()
  @Min(1)
  evseId?: number | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdTokenType)
  groupIdToken?: IdTokenType | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChargingProfileType)
  chargingProfile?: ChargingProfileType | null;
}
