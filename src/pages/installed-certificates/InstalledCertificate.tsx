// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from '@util/BaseModel';
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

export enum InstalledCertificateProps {
  id = 'id',
  stationId = 'stationId',
  hashAlgorithm = 'hashAlgorithm',
  issuerNameHash = 'issuerNameHash',
  issuerKeyHash = 'issuerKeyHash',
  serialNumber = 'serialNumber',
  certificateType = 'certificateType',
}

@ClassResourceType(ResourceType.INSTALLED_CERTIFICATES)
@ClassGqlListQuery(INSTALLED_CERTIFICATE_LIST_QUERY)
@ClassGqlGetQuery(INSTALLED_CERTIFICATE_GET_QUERY)
@ClassGqlCreateMutation(INSTALLED_CERTIFICATE_CREATE_MUTATION)
@ClassGqlEditMutation(INSTALLED_CERTIFICATE_EDIT_MUTATION)
@ClassGqlDeleteMutation(INSTALLED_CERTIFICATE_DELETE_MUTATION)
@PrimaryKeyFieldName(InstalledCertificateProps.id)
export class InstalledCertificate extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  stationId!: string;

  @IsString()
  @IsNotEmpty()
  hashAlgorithm!: string;

  @IsString()
  @IsNotEmpty()
  issuerNameHash!: string;

  @IsString()
  @IsNotEmpty()
  issuerKeyHash!: string;

  @IsString()
  @IsNotEmpty()
  serialNumber!: string;

  @IsString()
  @IsNotEmpty()
  certificateType!: string;
}
