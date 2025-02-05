import { ConnectorStatusEnumType } from '@citrineos/base';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class StatusNotificationDto {
  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsString()
  evseId!: number;

  @IsString()
  connectorId!: number;

  @IsString()
  timestamp!: string;

  @IsEnum(ConnectorStatusEnumType)
  connectorStatus!: ConnectorStatusEnumType;
}
