// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Col, Flex, Row, Select } from 'antd';
import { ReadingContextEnumType } from '@OCPP2_0_1';
import { renderEnumSelectOptions } from '@util/renderUtil';
import { PowerOverTime } from './power.over.time';
import { EnergyOverTime } from './energy.over.time';
import { StateOfCharge } from './state.of.charge';
import { VoltageOverTime } from './voltage.over.time';
import { CurrentOverTime } from './current.over.time';
import { IMeterValueDto } from '../../../../../citrineos-core/00_Base';

enum ChartType {
  POWER = 'Power Over Time',
  ENERGY = 'Energy Over Time',
  SOC = 'State of Charge Over Time',
  VOLTAGE = 'Voltage Over Time',
  CURRENT = 'Current Over Time',
}

const columnProps = {
  xs: { flex: '100%' },
  sm: { flex: '100%' },
  md: { flex: '50%' },
  lg: { flex: '30%' },
  xl: { flex: '30%' },
};
export const AllCharts = ({
  meterValues,
}: {
  meterValues: IMeterValueDto[];
}) => {
  const [validContexts, setValidContexts] = useState<ReadingContextEnumType[]>([
    ReadingContextEnumType.Transaction_Begin,
    ReadingContextEnumType.Sample_Periodic,
    ReadingContextEnumType.Transaction_End,
  ]);

  return (
    <Flex vertical gap={32} className="full-width">
      <Select
        mode="multiple"
        className="full-width"
        value={validContexts}
        onChange={(vals) => setValidContexts(vals as ReadingContextEnumType[])}
      >
        {renderEnumSelectOptions(ReadingContextEnumType)}
      </Select>

      <Row gutter={32}>
        <Col {...columnProps}>
          <PowerOverTime
            meterValues={meterValues}
            validContexts={validContexts}
          />
        </Col>
        <Col {...columnProps}>
          <EnergyOverTime
            meterValues={meterValues}
            validContexts={validContexts}
          />
        </Col>
        <Col {...columnProps}>
          <StateOfCharge
            meterValues={meterValues}
            validContexts={validContexts}
          />
        </Col>
        <Col {...columnProps}>
          <VoltageOverTime
            meterValues={meterValues}
            validContexts={validContexts}
          />
        </Col>
        <Col {...columnProps}>
          <CurrentOverTime
            meterValues={meterValues}
            validContexts={validContexts}
          />
        </Col>
      </Row>
    </Flex>
  );
};
