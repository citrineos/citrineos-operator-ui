// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  INSTALLED_CERTIFICATE_CREATE_MUTATION,
  INSTALLED_CERTIFICATE_DELETE_MUTATION,
  INSTALLED_CERTIFICATE_EDIT_MUTATION,
  INSTALLED_CERTIFICATE_GET_QUERY,
  INSTALLED_CERTIFICATE_LIST_QUERY,
} from './queries';
import {
  IInstalledCertificateDto,
  InstalledCertificateDtoProps,
} from '@citrineos/base';
import { IsInt, IsNotEmpty } from 'class-validator';
@ClassResourceType(ResourceType.INSTALLED_CERTIFICATES)
@ClassGqlListQuery(INSTALLED_CERTIFICATE_LIST_QUERY)
@ClassGqlGetQuery(INSTALLED_CERTIFICATE_GET_QUERY)
@ClassGqlCreateMutation(INSTALLED_CERTIFICATE_CREATE_MUTATION)
@ClassGqlEditMutation(INSTALLED_CERTIFICATE_EDIT_MUTATION)
@ClassGqlDeleteMutation(INSTALLED_CERTIFICATE_DELETE_MUTATION)
@PrimaryKeyFieldName(InstalledCertificateDtoProps.id)
export class InstalledCertificate implements Partial<IInstalledCertificateDto> {
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
