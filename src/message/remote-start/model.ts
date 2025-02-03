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
import { OCPP2_0_1 } from '@citrineos/base';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Evse } from '../../pages/evses/Evse';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { IdToken, IdTokenProps } from '../../pages/id-tokens/id-token';
import { ID_TOKENS_LIST_QUERY } from '../../pages/id-tokens/queries';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { EvseProps } from '../../pages/evses/EvseProps';

export class IdTokenType {
  @IsString()
  @MinLength(1)
  idToken!: string;

  @IsEnum(OCPP2_0_1.IdTokenEnumType)
  type!: OCPP2_0_1.IdTokenEnumType;
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

  @IsEnum(OCPP2_0_1.ChargingRateUnitEnumType)
  chargingRateUnit!: OCPP2_0_1.ChargingRateUnitEnumType;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ChargingSchedulePeriodType)
  chargingSchedulePeriod!: ChargingSchedulePeriodType[];

  @IsNumber()
  @IsOptional()
  minChargingRate?: number | null;
}

export enum RemoteStartChargingProfilePurpose {
  TxProfile = OCPP2_0_1.ChargingProfilePurposeEnumType.TxProfile,
}

export class ChargingProfileType {
  @IsOptional()
  @Type(() => CustomDataType)
  customData?: CustomDataType | null;

  @IsInt()
  stackLevel!: number;

  @IsEnum(RemoteStartChargingProfilePurpose)
  chargingProfilePurpose!: RemoteStartChargingProfilePurpose;

  @IsEnum(OCPP2_0_1.ChargingProfileKindEnumType)
  chargingProfileKind!: OCPP2_0_1.ChargingProfileKindEnumType;

  @IsOptional()
  @IsEnum(OCPP2_0_1.RecurrencyKindEnumType)
  recurrencyKind?: OCPP2_0_1.RecurrencyKindEnumType | null;

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
