// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AutoComplete, Form } from 'antd';
import { useSelect } from '@refinedev/antd';
import { BaseOption } from '@refinedev/core';
import { GET_EVSE_LIST_FOR_STATION } from '../../../message/queries';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ResourceType } from '@util/auth';
import { EvseDtoProps, IEvseDto } from '@citrineos/base';
import { IChargingStationDto } from '@citrineos/base';

export interface EvseSelectorProps {
  onSelect: (value: BaseOption) => void;
  onLoading: Dispatch<SetStateAction<boolean>>;
  station: IChargingStationDto;
  isOptional?: boolean;
}
export const EvseSelector = ({
  station,
  onSelect,
  onLoading,
  isOptional = false,
}: EvseSelectorProps) => {
  const { selectProps } = useSelect<IEvseDto>({
    resource: ResourceType.EVSES,
    optionLabel: (evse) => String(evse.evseTypeId),
    optionValue: (evse) => String(evse.evseTypeId),
    meta: {
      gqlQuery: GET_EVSE_LIST_FOR_STATION,
      gqlVariables: {
        offset: 0,
        limit: 10,
        stationId: station.id,
      },
    },
    sorters: [{ field: EvseDtoProps.evseTypeId, order: 'asc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => {
      const evseId = Number(value);
      if (!evseId || !Number.isInteger(evseId) || evseId < 1) {
        return [];
      }
      return [
        {
          operator: 'or',
          value: [{ field: EvseDtoProps.evseTypeId, operator: 'eq', value }],
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
      name="evseId"
      rules={[
        {
          validator: (_, value) => {
            const evseId = Number(value);
            if (Number.isInteger(evseId) && evseId >= 1) {
              return Promise.resolve();
            }
            if (isOptional && value === undefined) {
              return Promise.resolve();
            }
            return Promise.reject('EVSE Ids are serial integers starting at 1');
          },
        },
        ...(!isOptional
          ? [{ required: true, message: 'EVSE Id is required' }]
          : []),
      ]}
      getValueFromEvent={(event) => {
        return event === '' ? undefined : Number(event);
      }}
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
