import { ReportBaseEnumType } from "@citrineos/base";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
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

    @IsEnum(ReportBaseEnumType)
    reportBase!: ReportBaseEnumType;

    @Type(() => CustomDataType)
    @IsOptional()
    customData: CustomDataType | null = null;
}