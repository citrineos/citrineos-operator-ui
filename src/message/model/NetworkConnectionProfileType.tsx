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
import { OCPP2_0_1 } from '@citrineos/base';
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

  @IsEnum(OCPP2_0_1.OCPPVersionEnumType)
  @IsNotEmpty()
  ocppVersion!: OCPP2_0_1.OCPPVersionEnumType;

  @IsEnum(OCPP2_0_1.OCPPTransportEnumType)
  @IsNotEmpty()
  ocppTransport!: OCPP2_0_1.OCPPTransportEnumType;

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

  @IsEnum(OCPP2_0_1.OCPPInterfaceEnumType)
  @IsNotEmpty()
  ocppInterface!: OCPP2_0_1.OCPPInterfaceEnumType;

  @Type(() => VpnType)
  @ValidateNested()
  @IsOptional()
  vpn?: VpnType;
}
