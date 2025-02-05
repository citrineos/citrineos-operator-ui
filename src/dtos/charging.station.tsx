import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusNotificationDto } from './status.notification';
import { EvseDto } from './evse';
import { BaseDto } from './base';
import { TransactionDto } from './transaction';
import { OCPPLogsDto } from './ocpp.logs';
import { LatestStatusNotificationDto } from './latest.status.notification';

export class ChargingStationDto extends BaseDto {
  @IsString()
  id!: string;

  @IsBoolean()
  isOnline!: boolean;

  @IsOptional()
  locationId?: string;

  @IsArray()
  @IsOptional()
  @Type(() => StatusNotificationDto)
  statusNotifications?: StatusNotificationDto[];

  @IsArray()
  @IsOptional()
  @Type(() => LatestStatusNotificationDto)
  latestStatusNotifications?: LatestStatusNotificationDto[];

  @IsArray()
  @IsOptional()
  @Type(() => EvseDto)
  evses?: EvseDto[];

  @IsArray()
  @IsOptional()
  @Type(() => TransactionDto)
  transactions?: TransactionDto[];

  @IsArray()
  @IsOptional()
  @Type(() => OCPPLogsDto)
  ocppLogs?: OCPPLogsDto[];
}
