import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassResourceType } from '../../../../util/decorators/ClassResourceType';
import { ResourceType } from '../../../../resource-type';
import { LabelField } from '../../../../util/decorators/LabelField';
import { ClassGqlListQuery } from '../../../../util/decorators/ClassGqlListQuery';
import { ClassGqlDeleteMutation } from '../../../../util/decorators/ClassGqlDeleteMutation';
import {
  COMPONENT_CREATE_MUTATION,
  COMPONENT_DELETE_MUTATION,
  COMPONENT_EDIT_MUTATION,
  COMPONENT_GET_QUERY,
  COMPONENT_LIST_QUERY,
} from './queries';
import { PrimaryKeyFieldName } from '../../../../util/decorators/PrimaryKeyFieldName';
import { ClassGqlEditMutation } from '../../../../util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '../../../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../../../util/decorators/ClassGqlCreateMutation';
import { BaseModel } from '../../../../util/BaseModel';
import { Searchable } from '../../../../util/decorators/Searcheable';
import { Sortable } from '../../../../util/decorators/Sortable';
import { Hidden } from '../../../../util/decorators/Hidden';
import { CustomFormRender } from '../../../../util/decorators/CustomFormRender';
import { HiddenInTable } from '../../../../util/decorators/HiddenInTable';

export enum ComponentProps {
  id = 'id',
  instance = 'instance',
  name = 'name',
  evseDatabaseId = 'evseDatabaseId',
}

@ClassResourceType(ResourceType.COMPONENTS)
@LabelField(ComponentProps.name)
@ClassGqlListQuery(COMPONENT_LIST_QUERY)
@ClassGqlGetQuery(COMPONENT_GET_QUERY)
@ClassGqlCreateMutation(COMPONENT_CREATE_MUTATION)
@ClassGqlEditMutation(COMPONENT_EDIT_MUTATION)
@ClassGqlDeleteMutation(COMPONENT_DELETE_MUTATION)
@PrimaryKeyFieldName(ComponentProps.id)
export class Component extends BaseModel {
  @IsNumber()
  @Sortable()
  id!: number;

  @IsString()
  @Searchable()
  @Sortable()
  name!: string;

  @IsOptional()
  @IsString()
  instance?: string | null;

  @Hidden()
  @IsNumber()
  evseDatabaseId!: number;

  @IsNumber()
  @IsOptional()
  @HiddenInTable({ hiddenOnlyWhenEditing: true })
  @CustomFormRender((record: Component) => {
    return <span>{(record as any).Evse?.id}</span>;
  })
  evseId?: number;

  @IsNumber()
  @IsOptional()
  @HiddenInTable({ hiddenOnlyWhenEditing: true })
  @CustomFormRender((record: Component) => {
    return <span>{(record as any).Evse?.connectorId}</span>;
  })
  connectorId?: number;
}