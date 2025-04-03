import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MessageFormatEnumType,
  MessagePriorityEnumType,
  MessageStateEnumType,
} from '@OCPP2_0_1';
import { TransformDate } from '@util/TransformDate';
import { Dayjs } from 'dayjs';
import { CustomDataType } from '../../model/CustomData';

export class MessageContentType {
  @IsEnum(OCPP2_0_1.MessageFormatEnumType)
  format!: OCPP2_0_1.MessageFormatEnumType;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  language: string | null = null;

  @Type(() => CustomDataType)
  @IsOptional()
  customData: CustomDataType | null = null;
}

export class MessageInfo {
  @IsInt()
  databaseId!: number;

  @IsInt()
  id!: number;

  @IsString()
  stationId!: string;

  @IsEnum(OCPP2_0_1.MessagePriorityEnumType)
  priority!: OCPP2_0_1.MessagePriorityEnumType;

  @IsEnum(OCPP2_0_1.MessageStateEnumType)
  @IsOptional()
  state: OCPP2_0_1.MessageStateEnumType | null = null;

  @Type(() => Date)
  @IsDate()
  @TransformDate()
  startDateTime: Dayjs | null = null;

  @Type(() => Date)
  @IsDate()
  @TransformDate()
  endDateTime: Dayjs | null = null;

  @IsString()
  @IsOptional()
  transactionId: string | null = null;

  @Type(() => MessageContentType)
  @IsObject()
  message!: MessageContentType;

  @IsBoolean()
  active!: boolean;

  @IsInt()
  @IsOptional()
  displayComponentId: number | null = null;

  constructor(data: MessageInfo) {
    if (data) {
      this.databaseId = data.databaseId;
      this.id = data.id;
      this.stationId = data.stationId;
      this.priority = data.priority;
      this.state = data.state;
      this.startDateTime = data.startDateTime;
      this.endDateTime = data.endDateTime;
      this.transactionId = data.transactionId;
      this.message = data.message;
      this.active = data.active;
      this.displayComponentId = data.displayComponentId;
    }
  }
}
