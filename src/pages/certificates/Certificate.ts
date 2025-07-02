// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
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

export enum SignatureAlgorithmEnumType {
  RSA = 'SHA256withRSA',
  ECDSA = 'SHA256withECDSA',
}

export enum CountryNameEnumType {
  US = 'US',
}

export enum CertificateProps {
  id = 'id',
  serialNumber = 'serialNumber',
  issuerName = 'issuerName',
  organizationName = 'organizationName',
  commonName = 'commonName',
  keyLength = 'keyLength',
  validBefore = 'validBefore',
  signatureAlgorithm = 'signatureAlgorithm',
  countryName = 'countryName',
  isCA = 'isCA',
  pathLen = 'pathLen',
  certificateFileId = 'certificateFileId',
  privateKeyFileId = 'privateKeyFileId',
  signedBy = 'signedBy',
}

@ClassResourceType(ResourceType.CERTIFICATES)
@ClassGqlListQuery(CERTIFICATES_LIST_QUERY)
@ClassGqlGetQuery(CERTIFICATES_GET_QUERY)
@ClassGqlCreateMutation(CERTIFICATES_CREATE_MUTATION)
@ClassGqlEditMutation(CERTIFICATES_EDIT_MUTATION)
@ClassGqlDeleteMutation(CERTIFICATES_DELETE_MUTATION)
@PrimaryKeyFieldName(CertificateProps.id)
export class Certificate {
  @IsInt()
  id!: number;

  @IsInt()
  serialNumber!: number;

  @IsString()
  issuerName!: string;

  @IsString()
  organizationName!: string;

  @IsString()
  commonName!: string;

  @IsInt()
  @IsOptional()
  keyLength: number | null = null;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @TransformDate()
  validBefore: Dayjs | null = null;

  @IsOptional()
  @IsEnum(SignatureAlgorithmEnumType)
  signatureAlgorithm: SignatureAlgorithmEnumType | null = null;

  @IsOptional()
  @IsEnum(CountryNameEnumType)
  countryName: CountryNameEnumType | null = null;

  @IsBoolean()
  @IsOptional()
  isCA: boolean | null = null;

  @IsInt()
  @IsOptional()
  pathLen: number | null = null;

  @IsString()
  @IsOptional()
  certificateFileId: string | null = null;

  @IsString()
  @IsOptional()
  privateKeyFileId: string | null = null;

  @IsString()
  @IsOptional()
  signedBy: string | null = null;

  constructor(data?: Certificate) {
    if (data) {
      this.id = data.id;
      this.serialNumber = data.serialNumber;
      this.issuerName = data.issuerName;
      this.organizationName = data.organizationName;
      this.commonName = data.commonName;
      this.keyLength = data.keyLength;
      this.validBefore = data.validBefore;
      this.signatureAlgorithm = data.signatureAlgorithm;
      this.countryName = data.countryName;
      this.isCA = data.isCA;
      this.pathLen = data.pathLen;
      this.certificateFileId = data.certificateFileId;
      this.privateKeyFileId = data.privateKeyFileId;
      this.signedBy = data.signedBy;
    }
  }
}

export class NewCertificateRequest {
  @IsInt()
  @IsOptional()
  keyLength?: number;

  @IsString()
  organizationName!: string;

  @IsString()
  commonName!: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @TransformDate()
  validBefore: Dayjs | null = null;

  @IsString()
  @IsOptional()
  filePath?: string;

  @IsBoolean()
  selfSigned!: boolean;

  @IsOptional()
  @IsEnum(CountryNameEnumType)
  countryName?: CountryNameEnumType;

  @IsOptional()
  @IsEnum(SignatureAlgorithmEnumType)
  signatureAlgorithm?: SignatureAlgorithmEnumType;

  @IsInt()
  @IsOptional()
  pathLen?: number;
}
