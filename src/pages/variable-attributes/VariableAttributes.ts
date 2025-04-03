import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AttributeEnumType,
  DataEnumType,
  MutabilityEnumType,
} from '@OCPP2_0_1';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { Component, ComponentProps } from './components/Component';
import { Type } from 'class-transformer';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from './components/queries';
import { Variable, VariableProps } from './variables/Variable';
import { VARIABLE_GET_QUERY, VARIABLE_LIST_QUERY } from './variables/queries';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import {
  VARIABLE_ATTRIBUTE_CREATE_MUTATION,
  VARIABLE_ATTRIBUTE_DELETE_MUTATION,
  VARIABLE_ATTRIBUTE_EDIT_MUTATION,
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from './queries';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { BaseModel } from '@util/BaseModel';
import { LabelField } from '@util/decorators/LabelField';

export enum VariableAttributeProps {
  id = 'id',
  stationId = 'stationId',
  type = 'type',
  dataType = 'dataType',
  value = 'value',
  mutability = 'mutability',
  persistent = 'persistent',
  constant = 'constant',
  variableId = 'variableId',
  componentId = 'componentId',
  evseDatabaseId = 'evseDatabaseId',
  generatedAt = 'generatedAt',
}

@ClassResourceType(ResourceType.VARIABLE_ATTRIBUTES)
@LabelField(VariableAttributeProps.stationId)
@ClassGqlListQuery(VARIABLE_ATTRIBUTE_LIST_QUERY)
@ClassGqlGetQuery(VARIABLE_ATTRIBUTE_GET_QUERY)
@ClassGqlCreateMutation(VARIABLE_ATTRIBUTE_CREATE_MUTATION)
@ClassGqlEditMutation(VARIABLE_ATTRIBUTE_EDIT_MUTATION)
@ClassGqlDeleteMutation(VARIABLE_ATTRIBUTE_DELETE_MUTATION)
@PrimaryKeyFieldName(VariableAttributeProps.id)
export class VariableAttribute extends BaseModel {
  @IsNumber()
  id!: number;

  @IsString()
  stationId!: string;

  @IsOptional()
  @IsEnum(OCPP2_0_1.AttributeEnumType)
  type?: OCPP2_0_1.AttributeEnumType | null;

  @IsEnum(OCPP2_0_1.DataEnumType)
  dataType!: OCPP2_0_1.DataEnumType;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsOptional()
  @IsEnum(OCPP2_0_1.MutabilityEnumType)
  mutability?: OCPP2_0_1.MutabilityEnumType | null;

  @IsBoolean()
  persistent!: boolean;

  @IsBoolean()
  constant!: boolean;

  @GqlAssociation({
    parentIdFieldName: VariableAttributeProps.variableId,
    associatedIdFieldName: VariableProps.id,
    gqlQuery: {
      query: VARIABLE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_LIST_QUERY,
    },
  })
  @Type(() => Variable)
  @IsOptional()
  variableId?: Variable | null;

  @GqlAssociation({
    parentIdFieldName: VariableAttributeProps.componentId,
    associatedIdFieldName: ComponentProps.id,
    gqlQuery: {
      query: COMPONENT_GET_QUERY,
    },
    gqlListQuery: {
      query: COMPONENT_LIST_QUERY,
    },
  })
  @Type(() => Component)
  @IsOptional()
  componentId?: Component | null;

  @IsOptional()
  @IsNumber()
  evseDatabaseId?: number | null;

  @IsOptional()
  @IsString()
  generatedAt?: string;

  constructor(data: Partial<VariableAttribute>) {
    super();
    if (data) {
      Object.assign(this, {
        [VariableAttributeProps.id]: data.id,
        [VariableAttributeProps.stationId]: data.stationId,
        [VariableAttributeProps.type]: data.type,
        [VariableAttributeProps.dataType]: data.dataType,
        [VariableAttributeProps.value]: data.value,
        [VariableAttributeProps.mutability]: data.mutability,
        [VariableAttributeProps.persistent]: data.persistent,
        [VariableAttributeProps.constant]: data.constant,
        [VariableAttributeProps.variableId]: data.variableId,
        [VariableAttributeProps.componentId]: data.componentId,
        [VariableAttributeProps.evseDatabaseId]: data.evseDatabaseId,
        [VariableAttributeProps.generatedAt]: data.generatedAt,
      });
    }
  }
}
