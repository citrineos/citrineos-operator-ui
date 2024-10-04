import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDate } from '../../util/TransformDate';
import { Dayjs } from 'dayjs';

export enum SignatureAlgorithmEnumType {
  RSA = 'SHA256withRSA',
  ECDSA = 'SHA256withECDSA',
}

export enum CountryNameEnumType {
  US = 'US',
}

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

  constructor(data: Certificate) {
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
