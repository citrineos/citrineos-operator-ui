// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ConnectorDto, ConnectorDtoProps } from '../../../dtos/connector.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { AutoComplete, Form } from 'antd';
import { useSelect } from '@refinedev/antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { BaseOption } from '@refinedev/core';
import { CONNECTOR_ID_LIST_FOR_STATION_QUERY } from '../../../message/queries';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ResourceType } from '@util/auth';

export interface ConnectorSelectorProps {
  onSelect: (value: BaseOption) => void;
  onLoading: Dispatch<SetStateAction<boolean>>;
  station: ChargingStationDto;
  isOptional?: boolean;
}
export const ConnectorSelector = ({
  station,
  onSelect,
  onLoading,
  isOptional = false,
}: ConnectorSelectorProps) => {
  const { selectProps } = useSelect<ConnectorDto>({
    resource: ResourceType.CONNECTORS,
    optionLabel: (connector) => String(connector.connectorId),
    optionValue: (connector) => String(connector.connectorId),
    meta: {
      gqlQuery: CONNECTOR_ID_LIST_FOR_STATION_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
        stationId: station.id,
      },
    },
    sorters: [{ field: ConnectorDtoProps.connectorId, order: 'asc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => {
      const connectorId = Number(value);
      if (!connectorId || !Number.isInteger(connectorId) || connectorId < 1) {
        return [];
      }
      return [
        {
          operator: 'or',
          value: [
            { field: ConnectorDtoProps.connectorId, operator: 'eq', value },
          ],
        },
      ];
    },
  });

  useEffect(() => {
    onLoading(selectProps.loading || false);
  }, [selectProps.loading]);

  return (
    <Form.Item
      className={'full-width'}
      label="Connector"
      name="connectorId"
      rules={[
        {
          validator: (_, value) => {
            const connectorId = Number(value);
            if (Number.isInteger(connectorId) && connectorId >= 1) {
              return Promise.resolve();
            }
            if (isOptional && value === undefined) {
              return Promise.resolve();
            }
            return Promise.reject(
              'Connector Ids are serial integers starting at 1',
            );
          },
        },
        ...(!isOptional
          ? [{ required: true, message: 'Connector Id is required' }]
          : []),
      ]}
    >
      <AutoComplete
        className="full-width"
        placeholder="Search Connectors"
        onSelect={onSelect}
        {...selectProps}
      />
    </Form.Item>
  );
};
