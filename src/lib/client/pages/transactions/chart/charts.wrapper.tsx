// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type MeterValueDto, OCPP2_0_1 } from '@citrineos/base';
import { PowerOverTime } from '@lib/client/pages/transactions/chart/power.over.time';
import { EnergyOverTime } from '@lib/client/pages/transactions/chart/energy.over.time';
import { StateOfCharge } from '@lib/client/pages/transactions/chart/state.of.charge';
import React from 'react';
import { VoltageOverTime } from '@lib/client/pages/transactions/chart/voltage.over.time';
import { CurrentOverTime } from '@lib/client/pages/transactions/chart/current.over.time';

export const ChartsWrapper = ({
  meterValues,
  validContexts,
}: {
  meterValues: MeterValueDto[];
  validContexts: OCPP2_0_1.ReadingContextEnumType[];
}) => {
  return (
    <div className="grid grid-cols-3 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      <PowerOverTime meterValues={meterValues} validContexts={validContexts} />
      <EnergyOverTime meterValues={meterValues} validContexts={validContexts} />
      <StateOfCharge meterValues={meterValues} validContexts={validContexts} />
      <VoltageOverTime
        meterValues={meterValues}
        validContexts={validContexts}
      />
      <CurrentOverTime
        meterValues={meterValues}
        validContexts={validContexts}
      />
    </div>
  );
};
