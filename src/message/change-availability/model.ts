import { Type } from 'class-transformer';
import { Evse } from '../../pages/evses/Evse';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OperationalStatusEnumType } from '@citrineos/base';

import { NEW_IDENTIFIER } from '@util/consts';
import { EvseProps } from '../../pages/evses/EvseProps';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { GET_EVSE_LIST_FOR_STATION, GET_EVSES_FOR_STATION } from '../queries';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

export enum ChangeAvailabilityRequestProps {
  evse = 'evse',
  customData = 'customData',
  operationalStatus = 'operationalStatus',
}

export class ChangeAvailabilityRequest {
  @GqlAssociation({
    parentIdFieldName: ChangeAvailabilityRequestProps.evse,
    associatedIdFieldName: EvseProps.databaseId,
    gqlQuery: {
      query: GET_EVSES_FOR_STATION,
    },
    gqlListQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (_: ChangeAvailabilityRequest, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => Evse)
  @ValidateNested()
  @IsOptional()
  evse?: Evse | null;

  @IsEnum(OperationalStatusEnumType)
  @IsNotEmpty()
  operationalStatus!: OperationalStatusEnumType;

  constructor() {
    Object.assign(this, {
      [ChangeAvailabilityRequestProps.evse]: NEW_IDENTIFIER,
      [ChangeAvailabilityRequestProps.operationalStatus]: '',
    });
  }
}
