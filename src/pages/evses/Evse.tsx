// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsArray, IsNumber, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { FieldLabel } from '@util/decorators/FieldLabel';
import { ResourceType } from '@util/auth';
import { ClassResourceType } from '@util/decorators/ClassResourceType';

import {
  EVSE_CREATE_MUTATION,
  EVSE_DELETE_MUTATION,
  EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION,
  EVSE_GET_QUERY,
  EVSE_LIST_QUERY,
} from './queries';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import {
  ConnectorDtoProps,
  EvseDtoProps,
  IConnectorDto,
  IEvseDto,
} from '@citrineos/base';
import { Connector } from '../connectors/connector';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { GET_CONNECTOR_LIST_FOR_STATION_EVSE } from '../../message/queries';

@ClassResourceType(ResourceType.EVSES)
@ClassGqlListQuery(EVSE_LIST_QUERY)
@ClassGqlGetQuery(EVSE_GET_QUERY)
@ClassGqlCreateMutation(EVSE_CREATE_MUTATION)
@ClassGqlEditMutation(EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION)
@ClassGqlDeleteMutation(EVSE_DELETE_MUTATION)
@PrimaryKeyFieldName(EvseDtoProps.id)
export class Evse implements Partial<IEvseDto> {
  @IsNumber()
  id!: number;

  // @IsNumber()
  // @FieldLabel('Station ID')
  // stationId!: string;

  @IsNumber()
  @FieldLabel('EVSE Type ID')
  evseTypeId?: number;

  @FieldLabel('EVSE ID')
  evseId!: string;

  @FieldLabel('Physical Reference')
  physicalReference?: string | null;

  @FieldLabel('Removed')
  removed?: boolean;

  // @ValidateNested()
  // @Type(() => Object)
  // @FieldLabel('Charging Station')
  // chargingStation?: IChargingStationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @GqlAssociation({
    parentIdFieldName: EvseDtoProps.id,
    associatedIdFieldName: ConnectorDtoProps.evseId,
    hasNewAssociatedIdsVariable: true,
    gqlQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
    },
    gqlListSelectedQuery: {
      query: GET_CONNECTOR_LIST_FOR_STATION_EVSE,
      getQueryVariables: (evse: IEvseDto) => ({
        stationId: evse.stationId,
        where: {
          evseId: { _eq: evse.id },
        },
      }),
    },
  })
  @Type(() => Connector)
  @FieldLabel('Connectors')
  connectors?: IConnectorDto[] | null;

  constructor(data?: Partial<IEvseDto>) {
    if (data) {
      Object.assign(this, {
        id: data.id,
        // stationId: data.stationId,
        evseTypeId: data.evseTypeId,
        evseId: data.evseId,
        physicalReference: data.physicalReference,
        removed: data.removed,
        // chargingStation: data.chargingStation,
        connectors: data.connectors,
      });
    }
  }
}
