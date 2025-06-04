// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsInt, IsString } from 'class-validator';
import { BaseModel } from '@util/BaseModel';
import { ResourceType } from '@util/auth';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import {
  CHARGING_STATION_SEQUENCES_CREATE_MUTATION,
  CHARGING_STATION_SEQUENCES_DELETE_MUTATION,
  CHARGING_STATION_SEQUENCES_EDIT_MUTATION,
  CHARGING_STATION_SEQUENCES_GET_QUERY,
  CHARGING_STATION_SEQUENCES_LIST_QUERY,
} from './queries';
import { ChargingStationSequenceType } from '@citrineos/base';

export enum ChargingStationSequenceProps {
  stationId = 'stationId',
  type = 'type',
  value = 'value',
}

@ClassResourceType(ResourceType.CHARGING_STATION_SEQUENCES)
@ClassGqlListQuery(CHARGING_STATION_SEQUENCES_LIST_QUERY)
@ClassGqlGetQuery(CHARGING_STATION_SEQUENCES_GET_QUERY)
@ClassGqlCreateMutation(CHARGING_STATION_SEQUENCES_CREATE_MUTATION)
@ClassGqlEditMutation(CHARGING_STATION_SEQUENCES_EDIT_MUTATION)
@ClassGqlDeleteMutation(CHARGING_STATION_SEQUENCES_DELETE_MUTATION)
export class ChargingStationSequence extends BaseModel {
  // Unique index on stationId + type

  @IsString()
  stationId!: string;

  @IsEnum(ChargingStationSequenceType)
  type!: string;

  @IsInt()
  value!: number;

  constructor(data: Partial<ChargingStationSequence>) {
    super();
    if (data) {
      Object.assign(this, {
        [ChargingStationSequenceProps.stationId]: data.stationId,
        [ChargingStationSequenceProps.type]: data.type,
        [ChargingStationSequenceProps.value]: data.value,
      });
    }
  }
}
