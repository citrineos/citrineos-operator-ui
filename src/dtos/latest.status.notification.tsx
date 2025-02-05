import { IsInt, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base';
import { Type } from 'class-transformer';
import { StatusNotificationDto } from './status.notification';

export class LatestStatusNotificationDto extends BaseDto {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsInt()
  statusNotificationId!: number;

  @IsOptional()
  @Type(() => StatusNotificationDto)
  statusNotification?: StatusNotificationDto;
}
