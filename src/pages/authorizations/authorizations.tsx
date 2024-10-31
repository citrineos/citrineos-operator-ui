import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { BaseModel } from "../../util/BaseModel";
import { ClassResourceType } from "../../util/decorators/ClassResourceType";
import { ClassGqlListQuery } from "../../util/decorators/ClassGqlListQuery";
import { ClassGqlGetQuery } from "../../util/decorators/ClassGqlGetQuery";
import { ClassGqlCreateMutation } from "../../util/decorators/ClassGqlCreateMutation";
import { ClassGqlEditMutation } from "../../util/decorators/ClassGqlEditMutation";
import { ClassGqlDeleteMutation } from "../../util/decorators/ClassGqlDeleteMutation";
import { PrimaryKeyFieldName } from "../../util/decorators/PrimaryKeyFieldName";
import { ResourceType } from "../../resource-type";
import { AUTHORIZATIONS_CREATE_MUTATION, AUTHORIZATIONS_DELETE_MUTATION, AUTHORIZATIONS_EDIT_MUTATION, AUTHORIZATIONS_LIST_QUERY, AUTHORIZATIONS_SHOW_QUERY } from "./queries";
import { Type } from "class-transformer";

export enum AllowedConnectorTypes {
    Type1 = 'Type 1',
    Type2 = 'Type 2',
    CCS = 'CCS',
    CHAdeMO = 'CHAdeMO'
}

export enum DisallowedEvseIdPrefixes {
    EVSE1 = 'EVSE 1',
    EVSE2 = 'EVSE 2',
    EVSE3 = 'EVSE 3'
}

export enum AuthorizationsProps {
    id = 'id',
    allowedConnectorTypes = 'allowedConnectorTypes',
    disallowedEvseIdPrefixes = 'disallowedEvseIdPrefixes',
    idTokenId = 'idTokenId',
    idTokenInfoId = 'idTokenInfoId'
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

    //@ArrayMinSize(1)
    @IsArray()
    @ValidateNested({ each: true })
    //@Type(() => AllowedConnectorTypes)
    @IsNotEmpty()
    allowedConnectorTypes!: AllowedConnectorTypes[];

    @IsEnum(DisallowedEvseIdPrefixes)
    @IsNotEmpty()
    disallowedEvseIdPrefixes!: DisallowedEvseIdPrefixes;

    @IsInt()
    @IsNotEmpty()
    idTokenId!: number;

    @IsInt()
    @IsNotEmpty()
    idTokenInfoId!: number;
}