// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Type } from 'class-transformer';
import { Evse } from '../../../pages/evses/Evse';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OperationalStatusEnumType } from '@OCPP2_0_1';
import { NEW_IDENTIFIER } from '@util/consts';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../../queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { EvseProps } from '../../../pages/evses/EvseProps';

export enum ChangeAvailabilityRequestProps {
  customData = 'customData',
  evse = 'evse',
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
