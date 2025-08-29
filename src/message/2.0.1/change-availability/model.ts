// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Type } from 'class-transformer';
import { Evse } from '../../../pages/evses/Evse';
import { Connector } from '../../../pages/connectors/connector';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OperationalStatusEnumType } from '@OCPP2_0_1';
import { NEW_IDENTIFIER } from '@util/consts';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  GET_CONNECTOR_LIST_FOR_STATION_EVSE,
  GET_EVSE_LIST_FOR_STATION,
  GET_EVSES_FOR_STATION,
} from '../../queries';
import { getSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import {
  EvseDtoProps,
  type IConnectorDto,
  type IEvseDto,
} from '@citrineos/base';
import {
  ChangeAvailabilityRequestDtoProps,
  IChangeAvailabilityRequestDto,
} from '@citrineos/base';

export class ChangeAvailabilityRequest
  implements Partial<IChangeAvailabilityRequestDto>
{
  @GqlAssociation({
    parentIdFieldName: ChangeAvailabilityRequestDtoProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
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
  evse?: IEvseDto | null;

  @GqlAssociation({
    parentIdFieldName: ChangeAvailabilityRequestDtoProps.evse,
    associatedIdFieldName: EvseDtoProps.id,
    gqlQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
      getQueryVariables: (
        formData: ChangeAvailabilityRequest,
        selector: any,
      ) => {
        const station = selector(getSelectedChargingStation()) || {};
        // Access the current form's EVSE value to detect if an EVSE has been selected
        const selectedEvse = formData.evse;

        // Check if EVSE is selected and has a valid ID (not the NEW_IDENTIFIER placeholder)
        const hasValidEvse =
          selectedEvse &&
          selectedEvse.id &&
          (selectedEvse.id as any) !== NEW_IDENTIFIER;

        return {
          stationId: station.id,
          where: hasValidEvse ? { evseId: { _eq: selectedEvse.id } } : {},
        };
      },
    },
  })
  @Type(() => Connector)
  @ValidateNested()
  @IsOptional()
  connector?: IConnectorDto | null;

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
      [ChangeAvailabilityRequestDtoProps.evse]: NEW_IDENTIFIER,
      [ChangeAvailabilityRequestDtoProps.operationalStatus]: '',
    });
  }
}
