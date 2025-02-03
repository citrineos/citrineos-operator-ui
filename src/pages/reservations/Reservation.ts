import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OCPP2_0_1 } from '@citrineos/base';
import { CustomDataType } from '../../model/CustomData';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';

export class AdditionalInfoType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsString()
  additionalIdToken!: string;

  @IsString()
  type!: string;
}

export class IdTokenType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsOptional()
  @Type(() => AdditionalInfoType)
  additionalInfo?: AdditionalInfoType[];

  @IsString()
  idToken!: string;

  @IsEnum(OCPP2_0_1.IdTokenEnumType)
  type!: OCPP2_0_1.IdTokenEnumType;
}

export class Reservation {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @Type(() => Date)
  @IsDate()
  @TransformDate()
  expiryDateTime!: Dayjs;

  @IsEnum(OCPP2_0_1.ConnectorEnumType)
  @IsOptional()
  connectorType: OCPP2_0_1.ConnectorEnumType | null = null;

  @IsEnum(OCPP2_0_1.ReserveNowStatusEnumType)
  @IsOptional()
  reserveStatus: OCPP2_0_1.ReserveNowStatusEnumType | null = null;

  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  terminatedByTransaction: string | null = null;

  @Type(() => IdTokenType)
  @IsDefined()
  idToken!: IdTokenType;

  @Type(() => IdTokenType)
  @IsDefined()
  groupIdToken!: IdTokenType;

  @IsInt()
  @IsOptional()
  evseId: number | null = null;

  constructor(data: Reservation) {
    if (data) {
      this.databaseId = data.databaseId;
      this.id = data.id;
      this.stationId = data.stationId;
      this.expiryDateTime = data.expiryDateTime;
      this.connectorType = data.connectorType;
      this.reserveStatus = data.reserveStatus;
      this.isActive = data.isActive;
      this.terminatedByTransaction = data.terminatedByTransaction;
      this.idToken = data.idToken;
      this.groupIdToken = data.groupIdToken;
      this.evseId = data.evseId;
    }
  }
}
