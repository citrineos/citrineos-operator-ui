// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '@util/auth';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  CERTIFICATES_CREATE_MUTATION,
  CERTIFICATES_DELETE_MUTATION,
  CERTIFICATES_EDIT_MUTATION,
  CERTIFICATES_GET_QUERY,
  CERTIFICATES_LIST_QUERY,
} from './queries';
import {
  CertificateDtoProps,
  INewCertificateRequestDto,
} from '@citrineos/base';

@ClassResourceType(ResourceType.CERTIFICATES)
@ClassGqlListQuery(CERTIFICATES_LIST_QUERY)
@ClassGqlGetQuery(CERTIFICATES_GET_QUERY)
@ClassGqlCreateMutation(CERTIFICATES_CREATE_MUTATION)
@ClassGqlEditMutation(CERTIFICATES_EDIT_MUTATION)
@ClassGqlDeleteMutation(CERTIFICATES_DELETE_MUTATION)
@PrimaryKeyFieldName(CertificateDtoProps.id)
export class Certificate {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @TransformDate()
  validBefore: Dayjs | null = null;
}

export class NewCertificateRequest
  implements Partial<INewCertificateRequestDto>
{
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @TransformDate()
  validBefore: Dayjs | null = null;
}
