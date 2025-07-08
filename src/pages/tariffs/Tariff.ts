// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ITariffDto } from '@citrineos/base';

export class Tariff implements Partial<ITariffDto> {
  constructor(data: Partial<ITariffDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
