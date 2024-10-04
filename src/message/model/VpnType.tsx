import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VPNEnumType } from '@citrineos/base';

export class VpnType {
  // todo
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @MaxLength(512)
  @IsString()
  @IsNotEmpty()
  server!: string;

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  user!: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  group?: string;

  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  password!: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsEnum(VPNEnumType)
  @IsNotEmpty()
  type!: VPNEnumType;
}
