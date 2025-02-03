import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OCPP2_0_1 } from '@citrineos/base';

export class ApnType {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @MaxLength(512)
  @IsString()
  @IsNotEmpty()
  apn!: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  apnUserName?: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  apnPassword?: string;

  @IsInt()
  @IsOptional()
  simPin?: number;

  @MaxLength(6)
  @IsString()
  @IsOptional()
  preferredNetwork?: string;

  @IsBoolean()
  @IsOptional()
  useOnlyPreferredNetwork?: boolean;

  @IsEnum(OCPP2_0_1.APNAuthenticationEnumType)
  @IsNotEmpty()
  apnAuthentication!: OCPP2_0_1.APNAuthenticationEnumType;
}
