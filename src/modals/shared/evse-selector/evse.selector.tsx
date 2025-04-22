import { EvseDto, EvseDtoProps } from '../../../dtos/evse.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { AutoComplete, Form } from 'antd';
import { useSelect } from '@refinedev/antd';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { BaseOption } from '@refinedev/core';
import { GET_EVSE_LIST_FOR_STATION } from '../../../message/queries';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ResourceType } from '@util/auth';

export interface EvseSelectorProps {
  onSelect: (value: BaseOption) => void;
  onLoading: Dispatch<SetStateAction<boolean>>;
  station: ChargingStationDto;
  isOptional?: boolean;
}
export const EvseSelector = ({
  station,
  onSelect,
  onLoading,
  isOptional = false,
}: EvseSelectorProps) => {
  const { selectProps } = useSelect<EvseDto>({
    resource: ResourceType.EVSES,
    optionLabel: (evse) => String(evse.id),
    optionValue: (evse) => JSON.stringify(evse),
    meta: {
      gqlQuery: GET_EVSE_LIST_FOR_STATION,
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
          value: [{ field: EvseDtoProps.id, operator: 'eq', value }],
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
      label="EVSE"
      name="evse"
      rules={
        isOptional ? [] : [{ required: true, message: 'EVSE is required' }]
      }
    >
      <AutoComplete
        className="full-width"
        placeholder="Search EVSE"
        onSelect={onSelect}
        {...selectProps}
      />
    </Form.Item>
  );
};
