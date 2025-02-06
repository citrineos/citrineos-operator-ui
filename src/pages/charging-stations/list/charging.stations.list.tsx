import { Button, Col, GetProps, Input, Row, Table } from 'antd';
import React, { useState } from 'react';
import { CHARGING_STATIONS_LIST_QUERY } from '../queries';
import './style.scss';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { useNavigation } from '@refinedev/core';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { getPlainToInstanceOptions } from '@util/tables';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export const ChargingStationsList = () => {
  const [expandedRowByToggle, setExpandedRowByToggle] = useState<string>();
  const { push } = useNavigation();

  const { tableProps } = useTable<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    sorters: DEFAULT_SORTERS,
    metaData: {
      gqlQuery: CHARGING_STATIONS_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto),
  });

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    console.log(info?.source, value);
  };

  return (
    <Col>
      <Row justify="space-between" align="middle" className="header-row">
        <h2>Charging Stations</h2>
        <Row>
          <Button
            type="primary"
            style={{ marginRight: '20px' }}
            onClick={() => push('/charging-stations/new')}
          >
            Add New Charging Station
            <PlusIcon />
          </Button>
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </Row>
      </Row>
      <Table rowKey="id" {...tableProps}>
        <Table.Column
          key="id"
          dataIndex="id"
          title="ID"
          sorter={true}
          onCell={() => ({
            className: 'column-id',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>{record.id}</Col>;
          }}
        />
        <Table.Column
          key="location"
          dataIndex="location"
          title="Location"
          onCell={() => ({
            className: 'column-location',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>Location</Col>;
          }}
        />
        <Table.Column
          key="status"
          dataIndex="status"
          title="Status"
          onCell={() => ({
            className: 'column-status',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>{record.isOnline ? 'Online' : 'Offline'}</Col>;
          }}
        />
        <Table.Column
          key="timestamp"
          dataIndex="timestamp"
          title="Timestamp"
          onCell={() => ({
            className: 'column-timestamp',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>2025-01-29T19:52:42</Col>;
          }}
        />
        <Table.Column
          key="model"
          dataIndex="model"
          title="Model"
          onCell={() => ({
            className: 'column-model',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>0A78DF12el</Col>;
          }}
        />
        <Table.Column
          key="Vendor"
          dataIndex="Vendor"
          title="Vendor"
          onCell={() => ({
            className: 'column-Vendor',
          })}
          render={(_: any, record: ChargingStationDto) => {
            return <Col>Zerova</Col>;
          }}
        />
        <Table.Column
          key="actions"
          dataIndex="actions"
          title="Actions"
          onCell={() => ({
            className: 'column-actions',
          })}
          render={(_: any, record: ChargingStationDto) => (
            <Row
              onClick={() => push(`/charging-stations/${record.id}`)}
              className="pointer"
              align="middle"
            >
              View Station Detail <ArrowRightIcon />
            </Row>
          )}
        />
      </Table>
    </Col>
  );
};
