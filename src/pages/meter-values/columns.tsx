// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table } from 'antd';
import React from 'react';
import { MeterValueDtoProps } from '../../dtos/meter.value.dto';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { SampledValuesListView } from './sampled-value';
import { TimestampDisplay } from '../../components/timestamp-display';

export const getMeterValueColumns = () => {
  return (
    <>
      <Table.Column
        key={MeterValueDtoProps.id}
        dataIndex={MeterValueDtoProps.id}
        title="ID"
        sorter={true}
        onCell={() => ({
          className: 'column-id',
        })}
      />
      <Table.Column
        key={MeterValueDtoProps.timestamp}
        dataIndex={MeterValueDtoProps.timestamp}
        title="Timestamp"
        onCell={() => ({
          className: `column-${MeterValueDtoProps.timestamp}`,
        })}
        render={(timestamp) => {
          return <TimestampDisplay isoTimestamp={timestamp} />;
        }}
      />
      <Table.Column
        key={MeterValueDtoProps.sampledValue}
        dataIndex={MeterValueDtoProps.sampledValue}
        title="Sample Values"
        onCell={() => ({
          className: `column-${MeterValueDtoProps.sampledValue}`,
        })}
        render={(sampledValue, meterValue) => {
          return (
            <ExpandableColumn
              viewTitle={`Meter Value ${meterValue.id}`}
              expandedContent={
                <SampledValuesListView sampledValues={sampledValue} />
              }
            />
          );
        }}
      />
    </>
  );
};
