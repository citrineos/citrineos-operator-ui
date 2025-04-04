import { ReportBaseEnumType } from '@OCPP2_0_1';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CustomDataType } from '../../../model/CustomData';

export enum GetBaseReportRequestProps {
  requestId = 'requestId',
  reportBase = 'reportBase',
  customData = 'customData',
}

export class GetBaseReportRequest {
  @IsInt()
  @IsNotEmpty()
  requestId!: number;

  @IsEnum(ReportBaseEnumType)
  @IsNotEmpty()
  reportBase!: ReportBaseEnumType;

  @Type(() => CustomDataType)
  @IsOptional()
  customData?: CustomDataType | null;
}
