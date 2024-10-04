import { CustomDataType } from '../../model/CustomData';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatusInfoType {
  @Type(() => CustomDataType)
  @ValidateNested()
  @IsOptional()
  customData?: CustomDataType | null;

  @IsString()
  reasonCode!: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string | null;
}
