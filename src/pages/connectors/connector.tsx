// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import {
  CONNECTOR_CREATE_MUTATION,
  CONNECTOR_DELETE_MUTATION,
  CONNECTOR_EDIT_MUTATION,
  CONNECTOR_GET_QUERY,
  CONNECTOR_LIST_QUERY,
} from './queries';
import { ConnectorDtoProps, IConnectorDto } from '@citrineos/base';

@ClassResourceType(ResourceType.CONNECTORS)
@ClassGqlListQuery(CONNECTOR_LIST_QUERY)
@ClassGqlGetQuery(CONNECTOR_GET_QUERY)
@ClassGqlCreateMutation(CONNECTOR_CREATE_MUTATION)
@ClassGqlEditMutation(CONNECTOR_EDIT_MUTATION)
@ClassGqlDeleteMutation(CONNECTOR_DELETE_MUTATION)
@PrimaryKeyFieldName(ConnectorDtoProps.id)
export class Connector implements Partial<IConnectorDto> {}
