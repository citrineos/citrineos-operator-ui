// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ISubscriptionDto } from '@citrineos/base';

export class Subscription implements Partial<ISubscriptionDto> {
  constructor(data: Partial<ISubscriptionDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
