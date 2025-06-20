// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ConnectorStatusEnumType, ErrorCodes } from '@OCPP2_0_1';
import { IConnectorDto } from '@citrineos/base';

export class ConnectorDto implements Partial<IConnectorDto> {
  status?: ConnectorStatusEnumType;
  errorCode?: ErrorCodes;
}
