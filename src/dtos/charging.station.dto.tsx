import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { StatusNotificationDto } from './status.notification.dto';
import { EvseDto } from './evse.dto';
import { BaseDto } from './base.dto';
import { TransactionDto } from './transaction.dto';
import { OCPPLogsDto } from './ocpp.logs.dto';
import { LatestStatusNotificationDto } from './latest.status.notification.dto';
import { LocationDto } from './location.dto';

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
  @Expose({ name: 'StatusNotifications' })
  statusNotifications?: StatusNotificationDto[];

  @IsArray()
  @IsOptional()
  @Type(() => LatestStatusNotificationDto)
  @Expose({ name: 'LatestStatusNotifications' })
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

  @IsOptional()
  @Type(() => LocationDto)
  @Expose({ name: 'Location' })
  location?: Partial<LocationDto>;
}
