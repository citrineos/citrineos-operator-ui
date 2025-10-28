// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Col, Flex, Row, Select } from 'antd';
import { ReadingContextEnumType } from '@OCPP2_0_1';
import { PowerOverTime } from './power.over.time';
import { EnergyOverTime } from './energy.over.time';
import { StateOfCharge } from './state.of.charge';
import { VoltageOverTime } from './voltage.over.time';
import { CurrentOverTime } from './current.over.time';
import { IMeterValueDto } from '@citrineos/base';

const columnProps = {
  xs: { flex: '100%' },
  sm: { flex: '100%' },
  md: { flex: '50%' },
  lg: { flex: '50%' },
  xl: { flex: '50%' },
  xxl: { flex: '33.33333%' },
};
export const ChartsWrapper = ({
  meterValues,
  validContexts,
}: {
  meterValues: IMeterValueDto[];
  validContexts: ReadingContextEnumType[];
}) => {
  return (
    <Flex vertical gap={32} className="full-width">
      <Row gutter={[32, 32]}>
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
