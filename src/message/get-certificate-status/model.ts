import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { HashAlgorithmEnumType } from '@citrineos/base';
import { Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';

export class OCSPRequestDataType {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData: CustomDataType | null = null;

  @IsEnum(HashAlgorithmEnumType)
  hashAlgorithm: HashAlgorithmEnumType;

  @IsString()
  @Length(0, 128)
  issuerNameHash: string;

  @IsString()
  @Length(0, 128)
  issuerKeyHash: string;

  @IsString()
  @Length(0, 40)
  serialNumber: string;

  @IsString()
  @Length(0, 512)
  responderURL: string;
}

export class GetCertificateStatusRequest {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDataType)
  customData: CustomDataType | null = null;

  @IsDefined()
  @ValidateNested()
  @Type(() => OCSPRequestDataType)
  ocspRequestData: OCSPRequestDataType;
}
