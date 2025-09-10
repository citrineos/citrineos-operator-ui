// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useForm, useSelect } from '@refinedev/antd';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '../queries';
import { CanAccess, CrudFilter, useNavigation } from '@refinedev/core';
import { getSerializedValues } from '@util/middleware';
import { AutoComplete, Button, Flex, Form, Input, Modal, Select } from 'antd';
import {
  LOCATIONS_LIST_QUERY,
  LOCATIONS_GET_QUERY_BY_ID,
} from '../../locations/queries';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { useSearchParams } from 'react-router-dom';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { debounce } from 'lodash';
import { AccessDeniedFallback, ActionType, ResourceType } from '@util/auth';
import config from '@util/config';
import {
  ChargingStationCapability,
  ChargingStationDtoProps,
  ChargingStationParkingRestriction,
  ILocationDto,
  LocationDtoProps,
} from '@citrineos/base';

export const ChargingStationUpsert = () => {
  const params: any = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const stationId = params.id ? params.id : undefined;
  const locationId = searchParams.get('locationId');
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { replace, goBack } = useNavigation();

  const { formProps } = useForm({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    queryOptions: {
      enabled: !!stationId,
    },
    redirect: false,
    onMutationSuccess: (result) => {
      if (locationId) {
        goBack();
      } else {
        const newId = result.data.id;
        replace(`/${MenuSection.CHARGING_STATIONS}/${newId}`);
      }
    },
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
      gqlMutation: stationId
        ? CHARGING_STATIONS_EDIT_MUTATION
        : CHARGING_STATIONS_CREATE_MUTATION,
    },
  });

  const station = formProps.initialValues;

  const { selectProps } = useSelect<ILocationDto>({
    resource: ResourceType.LOCATIONS,
    optionLabel: (location: ILocationDto) => {
      return JSON.stringify(location);
    },
    optionValue: 'id',
    meta: {
      gqlQuery: locationId ? LOCATIONS_GET_QUERY_BY_ID : LOCATIONS_LIST_QUERY,
      gqlVariables: locationId
        ? { id: locationId }
        : {
            where: {},
            order_by: { updatedAt: 'desc' },
            offset: 0,
            limit: 5,
          },
    },
    pagination: {
      mode: 'off',
    },
    onSearch: debounce((value: string): CrudFilter[] => {
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
    }, 300) as (value: string) => CrudFilter[],
  });

  const resetSelectedLocation = useCallback(() => {
    if (station?.locationId && selectProps.options?.length) {
      const selected = selectProps.options.find(
        (option) => option.value?.toString() === station.locationId?.toString(),
      );

      if (selected) {
        const location = JSON.parse(selected.label as string) as ILocationDto;
        formProps.form?.setFieldsValue({
          locationId: selected.value,
          locationName: getLocationNameFromLocation(location),
        });
      }
    }
  }, [station?.locationId, selectProps.options, formProps.form]);

  useEffect(() => {
    resetSelectedLocation();
    if (locationId) {
      const selected = selectProps.options?.find(
        (option) => option.value?.toString() === locationId,
      );

      if (selected) {
        const location = JSON.parse(selected.label as string) as ILocationDto;
        formProps.form?.setFieldsValue({
          locationId: locationId,
          locationName: getLocationNameFromLocation(location),
        });
      }
    }
  }, [
    station?.locationId,
    selectProps.options,
    locationId,
    resetSelectedLocation,
  ]);

  const getLocationNameFromLocation = useCallback((location: ILocationDto) => {
    return `${location.name} - ${location.address}, ${location.city}, ${location.state} ${location.postalCode}`;
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      const selected = selectProps.options?.find(
        (option) => option.value?.toString() === value,
      );
      if (selected) {
        const location = JSON.parse(selected.label as string) as ILocationDto;
        formProps.form?.setFieldsValue({
          locationId: value,
          locationName: getLocationNameFromLocation(location),
        });
        handleOnChange();
      }
    },
    [selectProps.options, formProps.form, getLocationNameFromLocation],
  );

  const handleOnChange = useCallback(() => {
    setIsFormChanged(true);
  }, []);

  const handleReset = useCallback(() => {
    formProps.form?.resetFields();
    setIsFormChanged(false);
    resetSelectedLocation();
  }, [formProps.form, resetSelectedLocation]);

  const handleCancel = useCallback(() => {
    if (isFormChanged) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        onOk: () => replace('/charging-stations'),
      });
    } else {
      const stationId = station?.id;
      if (stationId) {
        replace(`/${MenuSection.CHARGING_STATIONS}/${stationId}`);
      } else {
        replace('/charging-stations');
      }
    }
  }, [isFormChanged, replace]);

  const onFinish = useCallback(
    async (input: any) => {
      delete input.locationName; // placeholder for AutoComplete input
      const newItem: any = getSerializedValues(input, ChargingStationDto);
      if (!stationId) {
        newItem.tenantId = config.tenantId;
      }
      formProps.onFinish?.(newItem);
    },
    [formProps],
  );

  const memoizedOptions = useMemo(() => {
    return selectProps.options?.map((option) => {
      const item = JSON.parse(option.label as string) as ILocationDto;
      return {
        value: option.value?.toString(), // AutoComplete expects string
        label: (
          <span>
            <strong>{item.name}</strong> - {item.address}
            {', '}
            {item.city}, {item.state} {item.postalCode}
          </span>
        ),
      };
    });
  }, [selectProps.options]);

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.EDIT}
      fallback={<AccessDeniedFallback />}
      params={{ id: stationId }}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={onFinish}
        onChange={handleOnChange}
        data-testid="charging-stations-create-form"
      >
        <Flex vertical gap={16}>
          <Flex gap={12} align={'center'}>
            <ArrowLeftIcon
              style={{
                cursor: 'pointer',
              }}
              onClick={() => goBack()}
            />
            <h3>{stationId ? 'Edit' : 'Create'} Charging Station</h3>
          </Flex>
          <Flex gap={16} wrap>
            <Form.Item
              key={ChargingStationDtoProps.id}
              label="Charging Station Id"
              name={ChargingStationDtoProps.id}
              rules={[
                { required: true, message: 'Charging Station ID is required' },
              ]}
              data-testid={ChargingStationDtoProps.id}
              style={{ width: '32%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={ChargingStationDtoProps.isOnline}
              label="Is Online"
              name={ChargingStationDtoProps.isOnline}
              data-testid={ChargingStationDtoProps.isOnline}
              style={{ width: '32%' }}
            >
              <Select onChange={handleOnChange}>
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
              style={{ width: '32%' }}
            >
              <AutoComplete
                {...selectProps}
                options={memoizedOptions}
                onSelect={handleSelect as any}
                filterOption={false}
                placeholder="Select a location"
              />
            </Form.Item>
            <Form.Item
              key={ChargingStationDtoProps.floorLevel}
              label="Floor Level"
              name={ChargingStationDtoProps.floorLevel}
              data-testid={ChargingStationDtoProps.floorLevel}
              style={{ width: '32%' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={ChargingStationDtoProps.parkingRestrictions}
              label="Parking Restrictions"
              name={ChargingStationDtoProps.parkingRestrictions}
              data-testid={ChargingStationDtoProps.parkingRestrictions}
              style={{ width: '32%' }}
            >
              <Select
                mode="tags"
                placeholder="Select parking restrictions"
                allowClear
              >
                {Object.keys(ChargingStationParkingRestriction).map(
                  (restriction) => (
                    <Select.Option key={restriction} value={restriction}>
                      {restriction}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              key={ChargingStationDtoProps.capabilities}
              label="Capabilities"
              name={ChargingStationDtoProps.capabilities}
              data-testid={ChargingStationDtoProps.capabilities}
              style={{ width: '32%' }}
            >
              <Select mode="tags" placeholder="Select capabilities" allowClear>
                {Object.keys(ChargingStationCapability).map((capability) => (
                  <Select.Option key={capability} value={capability}>
                    {capability}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>
          <Form.Item>
            <Flex gap={16}>
              {stationId && (
                <Button onClick={handleReset} disabled={!isFormChanged}>
                  Reset
                </Button>
              )}
              <Button onClick={handleCancel} danger>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                data-testid="locations-create-form-submit"
              >
                Submit
              </Button>
            </Flex>
          </Form.Item>
        </Flex>
      </Form>
    </CanAccess>
  );
};
