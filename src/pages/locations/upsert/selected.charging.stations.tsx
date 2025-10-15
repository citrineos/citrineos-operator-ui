// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useParams } from 'react-router';
import { useSelect } from '@refinedev/antd';
import React, { useEffect, useState } from 'react';
import { CanAccess, CrudFilter, useNavigation } from '@refinedev/core';
import {
  AutoComplete,
  Button,
  Flex,
  FormInstance,
  Table,
  TableProps,
} from 'antd';

import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { SearchIcon } from '../../../components/icons/search.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { CHARGING_STATIONS_LIST_QUERY } from '../../charging-stations/queries';
import { ResourceType, ActionType, AccessDeniedFallback } from '@util/auth';
import {
  BaseDtoProps,
  ChargingStationDtoProps,
  IChargingStationDto,
  LocationDtoProps,
} from '@citrineos/base';
import { PlusOutlined } from '@ant-design/icons';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

export interface SelectedChargingStationsProps {
  form: FormInstance;
}

export const SelectedChargingStations = ({
  form,
}: SelectedChargingStationsProps) => {
  const { push } = useNavigation();
  const params: any = useParams<{ id: string }>();
  const locationId = params.id ? params.id : undefined;

  const chargingStations = form.getFieldValue(LocationDtoProps.chargingPool);

  const [selectedChargingStations, setSelectedChargingStations] = useState<
    IChargingStationDto[]
  >([]);

  const handleAddNewChargingStation = () => {
    push(`/${MenuSection.CHARGING_STATIONS}/new?locationId=${locationId}`);
  };

  useEffect(() => {
    setSelectedChargingStations(
      form.getFieldValue(LocationDtoProps.chargingPool) || [],
    );
  }, [form.getFieldValue(LocationDtoProps.chargingPool)]);

  const [
    chargingStationAutoCompleteValue,
    setChargingStationAutoCompleteValue,
  ] = useState({
    value: '',
    label: '',
  });

  const { selectProps: selectedChargingStationsProps } =
    useSelect<IChargingStationDto>({
      resource: ResourceType.CHARGING_STATIONS,
      optionLabel: (chargingStation: IChargingStationDto) => {
        return JSON.stringify(chargingStation);
      },
      optionValue: 'id',
      meta: {
        gqlQuery: CHARGING_STATIONS_LIST_QUERY,
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
        return [
          {
            operator: 'or',
            value: [
              {
                field: ChargingStationDtoProps.id,
                operator: 'contains',
                value,
              },
            ],
          } as CrudFilter,
        ];
      },
    });

  const handleCheckboxSelection = (newSelectedRowKeys: React.Key[]) => {
    const prev = form.getFieldValue(LocationDtoProps.chargingPool);
    const newValue = prev.filter((chargingStation: IChargingStationDto) =>
      newSelectedRowKeys.includes(chargingStation.id),
    );
    form.setFieldsValue({
      [LocationDtoProps.chargingPool]: newValue,
    });
    setSelectedChargingStations(newValue);
  };

  const selectedChargingStationsRowSelection: TableRowSelection<IChargingStationDto> =
    {
      selectedRowKeys: selectedChargingStations.map((item) => item.id),
      onChange: handleCheckboxSelection,
    };

  const handleAutoCompleteSelection = (value: string) => {
    const chargingStation = JSON.parse(value) as ChargingStationDto;
    const prev = form.getFieldValue(LocationDtoProps.chargingPool);
    const newValue = [...prev, chargingStation];
    form.setFieldsValue({
      [LocationDtoProps.chargingPool]: newValue,
    });
    setSelectedChargingStations(newValue);
    setChargingStationAutoCompleteValue({
      value: '',
      label: '',
    });
  };

  function handleChargingStationAutoCompleteChange(value: string) {
    setChargingStationAutoCompleteValue({
      value: value,
      label: value,
    });
  }

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Flex gap={16}>
        {chargingStations != undefined && (
          <Flex vertical flex={1} gap={16}>
            <Flex align={'center'} justify={'space-between'}>
              <h3>Add Charging Stations</h3>

              <CanAccess
                resource={ResourceType.CHARGING_STATIONS}
                action={ActionType.CREATE}
                fallback={<AccessDeniedFallback />}
              >
                <Button
                  className="success"
                  icon={<PlusOutlined />}
                  iconPosition="end"
                  onClick={handleAddNewChargingStation}
                >
                  Create Charging Station
                </Button>
              </CanAccess>
            </Flex>
            <Flex>
              <AutoComplete
                className="full-width"
                suffixIcon={<SearchIcon />}
                onSelect={handleAutoCompleteSelection as any}
                onChange={handleChargingStationAutoCompleteChange as any}
                filterOption={false}
                placeholder="Search Charging Station"
                value={chargingStationAutoCompleteValue}
                {...selectedChargingStationsProps}
                options={
                  selectedChargingStationsProps.options &&
                  selectedChargingStationsProps.options.length > 0
                    ? selectedChargingStationsProps.options.map((option) => {
                        const item = JSON.parse(
                          option.label as string,
                        ) as IChargingStationDto;
                        return {
                          value: option.label,
                          label: (
                            <span>
                              Station ID: <strong>{item.id}</strong>
                            </span>
                          ),
                        } as any;
                      })
                    : [
                        {
                          value: '',
                          label: (
                            <span style={{ color: '#999' }}>
                              No matches found
                            </span>
                          ),
                          disabled: true,
                        },
                      ]
                }
              />
            </Flex>
          </Flex>
        )}
        <Flex flex={1}>
          <div />
        </Flex>
      </Flex>
      <Flex>
        <Table
          className="full-width"
          showHeader={false}
          rowKey="id"
          dataSource={selectedChargingStations}
          rowSelection={selectedChargingStationsRowSelection}
          pagination={false}
        >
          <Table.Column
            key="id"
            dataIndex="id"
            title="ID"
            onCell={() => ({
              className: 'column-id',
            })}
            render={(_: any, record: IChargingStationDto) => {
              return `Station id: ${record.id}`;
            }}
          />
          <Table.Column
            key="status"
            dataIndex="status"
            title="Status"
            onCell={() => ({
              className: 'column-status',
            })}
            render={(_: any, record: IChargingStationDto) => {
              return (
                <div className={record.isOnline ? 'online' : 'offline'}>
                  {record.isOnline ? 'Online' : 'Offline'}
                </div>
              );
            }}
          />
          <Table.Column
            key="configuration"
            dataIndex="configuration"
            title="Configuration"
            onCell={() => ({
              className: 'column-configuration',
            })}
            render={(_: any, record: IChargingStationDto) => {
              return (
                <div>{record.firmwareVersion ?? 'Needs configuration'}</div>
              );
            }}
          />
          <Table.Column
            key="model"
            dataIndex="model"
            title="Model"
            onCell={() => ({
              className: 'column-model',
            })}
            render={(_: any, record: IChargingStationDto) => {
              return <div>{record.chargePointModel ?? 'Needs model'}</div>;
            }}
          />
          <Table.Column
            key="vendor"
            dataIndex="vendor"
            title="Vendor"
            onCell={() => ({
              className: 'column-vendor',
            })}
            render={(_: any, record: IChargingStationDto) => {
              return <div>{record.chargePointVendor ?? 'Needs Vendor'}</div>;
            }}
          />
        </Table>
      </Flex>
    </CanAccess>
  );
};
