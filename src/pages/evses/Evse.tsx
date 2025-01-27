import { IsNumber, IsOptional } from 'class-validator';
import { ResourceType } from '../../resource-type';
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
import { BaseModel } from '@util/BaseModel';
import { EvseProps } from './EvseProps';

@ClassResourceType(ResourceType.EVSES)
@ClassGqlListQuery(EVSE_LIST_QUERY)
@ClassGqlGetQuery(EVSE_GET_QUERY)
@ClassGqlCreateMutation(EVSE_CREATE_MUTATION)
@ClassGqlEditMutation(EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION)
@ClassGqlDeleteMutation(EVSE_DELETE_MUTATION)
@PrimaryKeyFieldName(EvseProps.databaseId)
export class Evse extends BaseModel {
  @IsNumber()
  databaseId!: number;

  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  connectorId?: number | null;

  /* @Type(() => CustomDataType)
  @IsOptional()
  customData: CustomDataType | null = null;
  */

  constructor(data?: Partial<Evse>) {
    super();
    if (data) {
      Object.assign(this, {
        [EvseProps.databaseId]: data.databaseId,
        [EvseProps.id]: data.id,
        [EvseProps.connectorId]: data.connectorId,
      });
    }
  }
}
