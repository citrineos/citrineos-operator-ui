// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Descriptions, Divider, Typography } from 'antd';
import {
  LocationEnumType,
  MeasurandEnumType,
  PhaseEnumType,
  ReadingContextEnumType,
} from '@OCPP2_0_1';
import GenericTag from '../../../components/tag';
import { SampledValue } from '@citrineos/base';
// Define types based on ISampledValueDto structure
// These should ideally be imported from a shared types package if available
interface SignedMeterValueType {
  signedMeterData: string;
  signingMethod: string;
  encodingMethod: string;
  publicKey: string;
}

interface UnitOfMeasureType {
  unit?: string;
  multiplier?: number | null;
}

const { Text } = Typography;

interface SampledValueProps {
  sampledValue: SampledValue;
}

export const SampledValueView: React.FC<SampledValueProps> = ({
  sampledValue,
}) => {
  return (
    <Descriptions bordered size="small" column={1}>
      <Descriptions.Item label="Value">
        {sampledValue.value !== null && sampledValue.value !== undefined ? (
          sampledValue.value
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Context">
        {sampledValue.context ? (
          <GenericTag
            enumValue={sampledValue.context as ReadingContextEnumType}
            enumType={ReadingContextEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Measurand">
        {sampledValue.measurand ? (
          <GenericTag
            enumValue={sampledValue.measurand as MeasurandEnumType}
            enumType={MeasurandEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Phase">
        {sampledValue.phase ? (
          <GenericTag
            enumValue={sampledValue.phase as PhaseEnumType}
            enumType={PhaseEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Location">
        {sampledValue.location ? (
          <GenericTag
            enumValue={sampledValue.location as LocationEnumType}
            enumType={LocationEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

interface SampledValuesListProps {
  sampledValues: SampledValue[];
}

export const SampledValuesListView: React.FC<SampledValuesListProps> = ({
  sampledValues,
}) => {
  return (
    <div>
      {sampledValues.map((sampledValue, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <Divider orientation="left">Sampled Value {index + 1}</Divider>
          <SampledValueView sampledValue={sampledValue} />
        </div>
      ))}
    </div>
  );
};
