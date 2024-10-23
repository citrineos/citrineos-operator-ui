import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import {
  VariableAttribute,
  VariableAttributeProps,
} from './variable-attributes/VariableAttributes';
import { Type } from 'class-transformer';
import { FieldLabel } from '../../util/decorators/FieldLabel';
import { ResourceType } from '../../resource-type';
import { ClassResourceType } from '../../util/decorators/ClassResourceType';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import {
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from './variable-attributes/queries';
import {
  EVSE_CREATE_MUTATION,
  EVSE_DELETE_MUTATION,
  EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION,
  EVSE_GET_QUERY,
  EVSE_LIST_QUERY,
} from './queries';
import { ClassGqlDeleteMutation } from '../../util/decorators/ClassGqlDeleteMutation';
import { ClassGqlListQuery } from '../../util/decorators/ClassGqlListQuery';
import { PrimaryKeyFieldName } from '../../util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '../../util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../util/decorators/ClassGqlCreateMutation';
import { BaseModel } from '../../util/BaseModel';

export enum EvseProps {
  databaseId = 'databaseId',
  id = 'id',
  connectorId = 'connectorId',
  customData = 'customData',
  VariableAttributes = 'VariableAttributes',
}

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

  @IsOptional()
  @IsNumber()
  customData?: any | null;

  @IsArray()
  @Type(() => VariableAttribute)
  @ValidateNested({ each: true })
  @FieldLabel('Device Model')
  @GqlAssociation({
    parentIdFieldName: EvseProps.databaseId,
    associatedIdFieldName: VariableAttributeProps.evseDatabaseId,
    gqlQuery: VARIABLE_ATTRIBUTE_GET_QUERY,
    gqlListQuery: VARIABLE_ATTRIBUTE_LIST_QUERY,
  })
  VariableAttributes?: VariableAttribute[];

  constructor(data?: Partial<Evse>) {
    super();
    if (data) {
      Object.assign(this, {
        [EvseProps.databaseId]: data.databaseId,
        [EvseProps.id]: data.id,
        [EvseProps.connectorId]: data.connectorId,
        [EvseProps.customData]: data.customData,
        [EvseProps.VariableAttributes]: data.VariableAttributes,
      });
    }
  }
}
