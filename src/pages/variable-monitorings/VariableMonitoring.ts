import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { MonitorEnumType } from '@citrineos/base';

export class VariableMonitoring {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsBoolean()
  transaction!: boolean;

  @IsInt()
  value!: number;

  @IsEnum(MonitorEnumType)
  type!: MonitorEnumType;

  @IsInt()
  severity!: number;

  @IsInt()
  @IsOptional()
  variableId: number | null = null;

  @IsInt()
  @IsOptional()
  componentId: number | null = null;

  constructor(data: VariableMonitoring) {
    if (data) {
      this.databaseId = data.databaseId;
      this.id = data.id;
      this.stationId = data.stationId;
      this.transaction = data.transaction;
      this.value = data.value;
      this.type = data.type;
      this.severity = data.severity;
      this.variableId = data.variableId;
      this.componentId = data.componentId;
    }
  }
}
