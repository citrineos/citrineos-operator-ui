import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import TransformDatetime from '@util/TransformDatetime';
import { Type } from 'class-transformer';
import {
  ChargingLimitSourceEnumType,
  ChargingProfileKindEnumType,
  ChargingProfilePurposeEnumType,
  RecurrencyKindEnumType,
} from '@OCPP2_0_1';

export class ChargingProfile {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsEnum(OCPP2_0_1.ChargingProfileKindEnumType)
  chargingProfileKind!: OCPP2_0_1.ChargingProfileKindEnumType;

  @IsEnum(OCPP2_0_1.ChargingProfilePurposeEnumType)
  chargingProfilePurpose!: OCPP2_0_1.ChargingProfilePurposeEnumType;

  @IsOptional()
  @IsEnum(OCPP2_0_1.RecurrencyKindEnumType)
  recurrencyKind?: OCPP2_0_1.RecurrencyKindEnumType;

  @IsInt()
  stackLevel!: number;

  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validFrom: Date | null = null;

  @Type(() => Date)
  @TransformDatetime()
  @IsOptional()
  validTo: Date | null = null;

  @IsInt()
  @IsOptional()
  evseId?: number | null = null;

  @IsBoolean()
  @IsOptional()
  isActive: boolean | null = null;

  @IsOptional()
  @IsEnum(OCPP2_0_1.ChargingLimitSourceEnumType)
  chargingLimitSource: OCPP2_0_1.ChargingLimitSourceEnumType | null = null;

  @IsInt()
  @IsOptional()
  transactionDatabaseId: number | null = null;

  constructor(data: ChargingProfile) {
    if (data) {
      this.id = data.id;
      this.databaseId = data.databaseId;
      this.stationId = data.stationId;
      this.chargingProfileKind = data.chargingProfileKind;
      this.chargingProfilePurpose = data.chargingProfilePurpose;
      this.recurrencyKind = data.recurrencyKind;
      this.stackLevel = data.stackLevel;
      this.validFrom = data.validFrom;
      this.validTo = data.validTo;
      this.evseId = data.evseId;
      this.isActive = data.isActive;
      this.chargingLimitSource = data.chargingLimitSource;
      this.transactionDatabaseId = data.transactionDatabaseId;
    }
  }
}
