import {
  IConnectorDto,
  ConnectorStatus,
  ConnectorErrorCode,
} from '@citrineos/base';

export class ConnectorDto implements Partial<IConnectorDto> {
  status?: ConnectorStatus | null;
  errorCode?: ConnectorErrorCode | null;
}
