import { IsInt, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { Expose, Type } from 'class-transformer';
import { StatusNotificationDto } from './status.notification.dto';

export class LatestStatusNotificationDto extends BaseDto {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsInt()
  statusNotificationId!: number;

  @IsOptional()
  @Type(() => StatusNotificationDto)
  @Expose({ name: 'StatusNotification' })
  statusNotification?: StatusNotificationDto;
}
