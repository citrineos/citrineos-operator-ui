// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ConnectorStatusEnumType, ErrorCodes } from '@OCPP2_0_1';

export class ConnectorDto implements Partial<ConnectorDto> {
  status?: ConnectorStatusEnumType;
  errorCode?: ErrorCodes;
}
