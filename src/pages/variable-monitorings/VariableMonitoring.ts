// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IVariableMonitoringDto } from '@citrineos/base';

export class VariableMonitoring implements Partial<IVariableMonitoringDto> {
  constructor(data: Partial<IVariableMonitoringDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
