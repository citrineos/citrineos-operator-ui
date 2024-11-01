import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { BaseModel } from '../../util/BaseModel';
import { ClassResourceType } from '../../util/decorators/ClassResourceType';
import { ClassGqlListQuery } from '../../util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '../../util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '../../util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '../../util/decorators/PrimaryKeyFieldName';
import { ResourceType } from '../../resource-type';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_DELETE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_LIST_QUERY,
  AUTHORIZATIONS_SHOW_QUERY,
} from './queries';
import { Type } from 'class-transformer';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
import { IdToken, IdTokenProps } from '../id-tokens/id-token';
import {
  ID_TOKENS_LIST_QUERY,
  ID_TOKENS_SHOW_QUERY,
} from '../id-tokens/queries';
import {
  IdTokenInfos,
  IdTokenInfosProps,
} from '../id-tokens-infos/id-token-infos';
import {
  ID_TOKEN_INFOS_LIST_QUERY,
  ID_TOKEN_INFOS_SHOW_QUERY,
} from '../id-tokens-infos/queries';

export enum AllowedConnectorTypes {
  Type1 = 'Type 1',
  Type2 = 'Type 2',
  CCS = 'CCS',
  CHAdeMO = 'CHAdeMO',
}

export enum DisallowedEvseIdPrefixes {
  EVSE1 = 'EVSE 1',
  EVSE2 = 'EVSE 2',
  EVSE3 = 'EVSE 3',
}

export enum AuthorizationsProps {
  id = 'id',
  allowedConnectorTypes = 'allowedConnectorTypes',
  disallowedEvseIdPrefixes = 'disallowedEvseIdPrefixes',
  idTokenId = 'idTokenId',
  idTokenInfoId = 'idTokenInfoId',
}

@ClassResourceType(ResourceType.AUTHORIZATIONS)
@ClassGqlListQuery(AUTHORIZATIONS_LIST_QUERY)
@ClassGqlGetQuery(AUTHORIZATIONS_SHOW_QUERY)
@ClassGqlCreateMutation(AUTHORIZATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(AUTHORIZATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(AUTHORIZATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(AuthorizationsProps.id)
export class Authorizations extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowedConnectorTypes as any)
  @IsNotEmpty()
  allowedConnectorTypes!: AllowedConnectorTypes[];

  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisallowedEvseIdPrefixes as any)
  @IsNotEmpty()
  disallowedEvseIdPrefixes!: DisallowedEvseIdPrefixes[];

  @GqlAssociation({
    parentIdFieldName: AuthorizationsProps.idTokenId,
    associatedIdFieldName: IdTokenProps.id,
    gqlQuery: {
      query: ID_TOKENS_SHOW_QUERY,
    },
    gqlListQuery: {
      query: ID_TOKENS_LIST_QUERY,
    },
  })
  @Type(() => IdToken)
  @IsNotEmpty()
  idTokenId!: IdToken;

  @GqlAssociation({
    parentIdFieldName: AuthorizationsProps.idTokenInfoId,
    associatedIdFieldName: IdTokenInfosProps.id,
    gqlQuery: {
      query: ID_TOKEN_INFOS_SHOW_QUERY,
    },
    gqlListQuery: {
      query: ID_TOKEN_INFOS_LIST_QUERY,
    },
  })
  @Type(() => IdTokenInfos)
  @IsNotEmpty()
  idTokenInfoId!: IdTokenInfos;
}
