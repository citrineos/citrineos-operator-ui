import { ConnectorDto, ConnectorDtoProps } from '../../../dtos/connector.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { AutoComplete, Form } from 'antd';
import { useSelect } from '@refinedev/antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { BaseOption } from '@refinedev/core';
import { CONNECTOR_LIST_FOR_STATION_QUERY } from '../../../message/queries';
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
    optionValue: (connector) => JSON.stringify(connector.connectorId),
    meta: {
      gqlQuery: CONNECTOR_LIST_FOR_STATION_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
        stationId: station.id,
      },
    },
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => {
      if (!value) {
        return [];
      }
      return [
        {
          operator: 'or',
          value: [{ field: ConnectorDtoProps.id, operator: 'eq', value }],
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
      name="connector"
      rules={
        isOptional ? [] : [{ required: true, message: 'Connector is required' }]
      }
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
