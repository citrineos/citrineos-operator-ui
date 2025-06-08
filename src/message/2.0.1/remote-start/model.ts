// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
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
} from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../../model/CustomData';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Evse } from '../../../pages/evses/Evse';
import { GET_EVSE_LIST_FOR_STATION } from '../../queries';
import { IdToken, IdTokenProps } from '../../../pages/id-tokens/id-token';
import { ID_TOKENS_LIST_QUERY } from '../../../pages/id-tokens/queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { EvseProps } from '../../../pages/evses/EvseProps';

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
  customData?: CustomDataType | null;

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
  numberPhases?: number | null;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  phaseToUse?: number | null;
}

export class ChargingScheduleType {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsInt()
  @IsPositive()
  id!: number;

  @Type(() => Date)
  @TransformDate()
  @IsOptional()
  startSchedule?: Dayjs | null;

  @IsInt()
  @IsOptional()
  duration?: number | null;

  @IsEnum(ChargingRateUnitEnumType)
  chargingRateUnit!: ChargingRateUnitEnumType;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ChargingSchedulePeriodType)
  chargingSchedulePeriod!: ChargingSchedulePeriodType[];

  @IsNumber()
  @IsOptional()
  minChargingRate?: number | null;
}

export enum RemoteStartChargingProfilePurpose {
  TxProfile = ChargingProfilePurposeEnumType.TxProfile as any,
}

export class ChargingProfileType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsInt()
  stackLevel!: number;

  @IsEnum(RemoteStartChargingProfilePurpose)
  chargingProfilePurpose!: RemoteStartChargingProfilePurpose;

  @IsEnum(ChargingProfileKindEnumType)
  chargingProfileKind!: ChargingProfileKindEnumType;

  @IsOptional()
  @IsEnum(RecurrencyKindEnumType)
  recurrencyKind?: RecurrencyKindEnumType | null;

  @IsOptional()
  @Type(() => Date)
  @TransformDate()
  validFrom?: Dayjs | null;

  @IsOptional()
  @Type(() => Date)
  @TransformDate()
  validTo?: Dayjs | null;

  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested()
  @Type(() => ChargingScheduleType)
  chargingSchedule!: ChargingScheduleType[];
}

export enum RequestStartTransactionRequestProps {
  remoteStartId = 'remoteStartId',
  idToken = 'idToken',
  evse = 'evse',
  customData = 'customData',
  groupIdToken = 'groupIdToken',
  chargingProfile = 'chargingProfile',
}

export class RequestStartTransactionRequest {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  remoteStartId!: number;

  @GqlAssociation({
    parentIdFieldName: RequestStartTransactionRequestProps.idToken,
    associatedIdFieldName: IdTokenProps.id,
    gqlQuery: {
      query: ID_TOKENS_LIST_QUERY,
    },
    gqlListQuery: {
      query: ID_TOKENS_LIST_QUERY,
    },
  })
  @Type(() => IdToken)
  @IsNotEmpty()
  idToken!: IdToken | null;

  @GqlAssociation({
    parentIdFieldName: RequestStartTransactionRequestProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: RequestStartTransactionRequest, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Evse)
  @IsNotEmpty()
  evse!: Evse | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdTokenType)
  groupIdToken?: IdTokenType | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChargingProfileType)
  chargingProfile?: ChargingProfileType | null;
}
