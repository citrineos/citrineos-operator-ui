// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Descriptions, Divider, Typography } from 'antd';
import { SampledValue, SignedMeterValue, UnitOfMeasure } from '../SampledValue';
import {
  LocationEnumType,
  MeasurandEnumType,
  PhaseEnumType,
  ReadingContextEnumType,
} from '@OCPP2_0_1';
import GenericTag from '../../../components/tag';

const { Text } = Typography;

interface SampledValueProps {
  sampledValue: SampledValue;
}

export const SampledValueView: React.FC<SampledValueProps> = ({
  sampledValue,
}) => {
  const renderSignedMeterValue = (
    signedMeterValue?: SignedMeterValue | null | undefined,
  ) => {
    if (!signedMeterValue) return <Text type="secondary">N/A</Text>;

    return (
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="Signed Meter Data">
          {signedMeterValue.signedMeterData}
        </Descriptions.Item>
        <Descriptions.Item label="Signing Method">
          {signedMeterValue.signingMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Encoding Method">
          {signedMeterValue.encodingMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Public Key">
          {signedMeterValue.publicKey}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderUnitOfMeasure = (
    unitOfMeasure?: UnitOfMeasure | undefined | null,
  ) => {
    if (!unitOfMeasure) return <Text type="secondary">N/A</Text>;

    return (
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="Unit">
          {unitOfMeasure.unit ?? <Text type="secondary">N/A</Text>}
        </Descriptions.Item>
        <Descriptions.Item label="Multiplier">
          {unitOfMeasure.multiplier !== null &&
          unitOfMeasure.multiplier !== undefined ? (
            unitOfMeasure.multiplier
          ) : (
            <Text type="secondary">N/A</Text>
          )}
        </Descriptions.Item>
      </Descriptions>
    );
  };

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
            enumValue={sampledValue.context}
            enumType={ReadingContextEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Measurand">
        {sampledValue.measurand ? (
          <GenericTag
            enumValue={sampledValue.measurand}
            enumType={MeasurandEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Phase">
        {sampledValue.phase ? (
          <GenericTag enumValue={sampledValue.phase} enumType={PhaseEnumType} />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Location">
        {sampledValue.location ? (
          <GenericTag
            enumValue={sampledValue.location}
            enumType={LocationEnumType}
          />
        ) : (
          <Text type="secondary">N/A</Text>
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Signed Meter Value">
        {renderSignedMeterValue(sampledValue.signedMeterValue)}
      </Descriptions.Item>

      <Descriptions.Item label="Unit Of Measure">
        {renderUnitOfMeasure(sampledValue.unitOfMeasure)}
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
