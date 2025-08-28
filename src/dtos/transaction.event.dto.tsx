import { ITransactionEventDto, IMeterValueDto } from '@citrineos/base';
import { TransactionEventEnumType, TriggerReasonEnumType } from '@OCPP2_0_1';

export class TransactionEventDto implements Partial<ITransactionEventDto> {
  id?: number;
  stationId!: string;
  evseId?: number | null;
  transactionDatabaseId?: string;
  eventType!: any;
  meterValues?: IMeterValueDto[];
  timestamp!: string;
  triggerReason!: TriggerReasonEnumType;
  seqNo!: number;
  offline?: boolean | null;
  numberOfPhasesUsed?: number | null;
  cableMaxCurrent?: number | null;
  reservationId?: number | null;
  idTokenValue?: string | null;
  idTokenType?: string | null;
  transactionInfo?: any;
}
