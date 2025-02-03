import { OCPP2_0_1 } from '@citrineos/base';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { CustomDataType } from '../../model/CustomData';

export enum GetBaseReportRequestProps {
  requestId = 'requestId',
  reportBase = 'reportBase',
  customData = 'customData',
}

export class GetBaseReportRequest {
  @IsInt()
  @IsNotEmpty()
  requestId!: number;

  @IsEnum(OCPP2_0_1.ReportBaseEnumType)
  @IsNotEmpty()
  reportBase!: OCPP2_0_1.ReportBaseEnumType;

  @Type(() => CustomDataType)
  @IsOptional()
  customData?: CustomDataType | null;
}
