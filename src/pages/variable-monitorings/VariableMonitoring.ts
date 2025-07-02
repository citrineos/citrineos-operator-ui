// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IVariableMonitoring } from '@citrineos/base';

export class VariableMonitoring implements Partial<IVariableMonitoring> {
  constructor(data: Partial<IVariableMonitoring>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
