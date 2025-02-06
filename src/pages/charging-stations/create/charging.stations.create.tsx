import { useForm, UseFormProps, useSelect } from '@refinedev/antd';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '../queries';
import { CrudFilter, useNavigation } from '@refinedev/core';
import { getSerializedValues } from '@util/middleware';
import { AutoComplete, Button, Flex, Form, Input, Select } from 'antd';
import { ResourceType } from '../../../resource-type';
import { LocationDto, LocationDtoProps } from '../../../dtos/location.dto';
import { LOCATIONS_LIST_QUERY } from '../../locations/queries';
import {
  ChargingStationDto,
  ChargingStationDtoProps,
} from '../../../dtos/charging.station.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import React from 'react';
import { LocationIcon } from '../../../components/icons/location.icon';

export const ChargingStationCreate = () => {
  const { replace } = useNavigation();

  const obj: UseFormProps = {
    resource: ResourceType.CHARGING_STATIONS,
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      replace('/charging-stations');
    },
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
      gqlMutation: CHARGING_STATIONS_CREATE_MUTATION,
    },
  };

  const { formProps } = useForm(obj);

  const { selectProps } = useSelect<LocationDto>({
    resource: ResourceType.LOCATIONS,
    optionLabel: (location: LocationDto) => {
      return JSON.stringify(location);
    },
    optionValue: 'id',
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 5,
      },
    },
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: {
      mode: 'off',
    },
    onSearch: (value: string) => {
      if (!value) {
        return [];
      }
      const valueList = [
        { field: LocationDtoProps.name, operator: 'contains', value },
        { field: LocationDtoProps.address, operator: 'contains', value },
        { field: LocationDtoProps.city, operator: 'contains', value },
        { field: LocationDtoProps.state, operator: 'contains', value },
        { field: LocationDtoProps.postalCode, operator: 'contains', value },
      ];
      if (!isNaN(Number(value))) {
        valueList.unshift({
          field: LocationDtoProps.id,
          operator: 'eq',
          value,
        });
      }
      return [
        {
          operator: 'or',
          value: valueList,
        } as CrudFilter,
      ];
    },
  });

  const handleSelect = (value: string) => {
    const selected = selectProps.options?.find(
      (option) => option.value === value,
    );
    if (selected) {
      const location = JSON.parse(selected.label as string) as LocationDto;
      setSelectedLocation(location);
      formProps.form?.setFieldsValue({
        locationId: value,
        locationName: `${location.name} - ${location.address}, ${location.city}, ${location.state} ${location.postalCode}`,
      });
    }
  };
  const onFinish = async (input: any) => {
    delete input.locationName; // placeholder for AutoComplete input
    const newItem: any = getSerializedValues(input, ChargingStationDto);
    formProps.onFinish?.(newItem);
  };

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      data-testid="charging-stations-create-form"
    >
      <Flex gap={32}>
        <Flex flex={1} vertical>
          <Form.Item
            key={ChargingStationDtoProps.id}
            label="Charging Station Id"
            name={ChargingStationDtoProps.id}
            rules={[
              { required: true, message: 'Charging Station ID is required' },
            ]}
            data-testid={ChargingStationDtoProps.id}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key={ChargingStationDtoProps.isOnline}
            label="Is Online"
            name={ChargingStationDtoProps.isOnline}
            data-testid={ChargingStationDtoProps.isOnline}
          >
            <Select>
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            key={ChargingStationDtoProps.locationId}
            label="LocationId"
            name={ChargingStationDtoProps.locationId}
            data-testid={ChargingStationDtoProps.locationId}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            key="locationName"
            label="Location"
            name="locationName"
            data-testid="locationName"
            rules={[{ required: true, message: 'Please select a location' }]}
          >
            <AutoComplete
              {...selectProps}
              options={selectProps.options?.map((option) => {
                const location = JSON.parse(
                  option.label as string,
                ) as LocationDto;
                return {
                  value: option.value,
                  label: (
                    <span>
                      <strong>{location.name}</strong> - {location.address}
                      {', '}
                      {location.city}, {location.state} {location.postalCode}
                    </span>
                  ),
                };
              })}
              onSelect={handleSelect as any}
              filterOption={false}
              placeholder="Select a location"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              data-testid="locations-create-form-submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Flex>
        <Flex
          vertical
          flex={1}
          align={'center'}
          justify={'center'}
          style={{
            background: '#D9D9D9',
            color: '#C3BDB9',
          }}
        >
          <LocationIcon width={100} height={100} />
          UPLOAD CHARGING STATION IMAGE
        </Flex>
      </Flex>
    </Form>
  );
};
