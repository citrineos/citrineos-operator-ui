import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApnType } from './ApnType';
import {
  OCPPInterfaceEnumType,
  OCPPTransportEnumType,
  OCPPVersionEnumType,
} from '@citrineos/base';
import { VpnType } from './VpnType';
import { Type } from 'class-transformer';

export class NetworkConnectionProfileType {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @Type(() => ApnType)
  @ValidateNested()
  @IsOptional()
  apn?: ApnType;

  @IsEnum(OCPPVersionEnumType)
  @IsNotEmpty()
  ocppVersion!: OCPPVersionEnumType;

  @IsEnum(OCPPTransportEnumType)
  @IsNotEmpty()
  ocppTransport!: OCPPTransportEnumType;

  @MaxLength(512)
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  ocppCsmsUrl!: string;

  @IsInt()
  @IsNotEmpty()
  messageTimeout!: number;

  @IsInt()
  @IsNotEmpty()
  securityProfile!: number;

  @IsEnum(OCPPInterfaceEnumType)
  @IsNotEmpty()
  ocppInterface!: OCPPInterfaceEnumType;

  @Type(() => VpnType)
  @ValidateNested()
  @IsOptional()
  vpn?: VpnType;
}
