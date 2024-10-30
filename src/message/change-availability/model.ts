import { Type } from 'class-transformer';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OperationalStatusEnumType } from '@citrineos/base';
import { NEW_IDENTIFIER } from '../../util/consts';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION, GET_EVSES_FOR_STATION } from '../queries';

export enum ChangeAvailabilityRequestProps {
  customData = 'customData',
  evse = 'evse',
  operationalStatus = 'operationalStatus',
}

export class ChangeAvailabilityRequest {
  @GqlAssociation({
    parentIdFieldName: ChangeAvailabilityRequestProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: GET_EVSES_FOR_STATION,
    gqlListQuery: GET_EVSE_LIST_FOR_STATION,
    gqlUseQueryVariablesKey: ChangeAvailabilityRequestProps.evse,
  })
  @Type(() => Evse)
  @ValidateNested()
  @IsOptional()
  evse?: Evse | null;

  @IsEnum(OperationalStatusEnumType)
  @IsNotEmpty()
  operationalStatus!: OperationalStatusEnumType;

  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType | null;

  constructor() {
    Object.assign(this, {
      [ChangeAvailabilityRequestProps.evse]: NEW_IDENTIFIER,
      [ChangeAvailabilityRequestProps.operationalStatus]: '',
    });
  }
}

export interface ChangeAvailabilityProps {
  station: ChargingStation;
}
