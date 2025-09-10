// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  IConnectorDto,
  ConnectorStatus,
  ConnectorErrorCode,
} from '@citrineos/base';

export class ConnectorDto implements Partial<IConnectorDto> {
  id?: number;
  status?: ConnectorStatus | null;
  errorCode?: ConnectorErrorCode | null;
}
