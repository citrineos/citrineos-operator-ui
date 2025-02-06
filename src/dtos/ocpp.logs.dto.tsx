import { IsString } from 'class-validator';
import { BaseDto } from './base.dto';

export class OCPPLogsDto extends BaseDto {
  @IsString()
  id!: string;

  @IsString()
  stationId!: string;

  @IsString()
  origin!: string;

  @IsString()
  log!: string;
}
