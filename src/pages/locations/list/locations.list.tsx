import { Button, Col, GetProps, Input, Row, Table } from 'antd';
import React, { useState } from 'react';
import { LOCATIONS_DELETE_MUTATION, LOCATIONS_LIST_QUERY } from '../queries';
import { LocationDto } from '../../../dtos/location';
import './style.scss';
import { ArrowDownIcon } from '../../../components/icons/arrow.down';
import { LocationsChargignStationsTable } from './locations.charging.stations.table';
import { DeleteButton, useTable } from '@refinedev/antd';
import { EyeIcon } from '../../../components/icons/eye';
import { EditIcon } from '../../../components/icons/edit';
import { TrashIcon } from '../../../components/icons/trash';
import { ResourceType } from '../../../resource-type';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { PlusIcon } from '../../../components/icons/plus';
import { useNavigation } from '@refinedev/core';
import { getPlainToInstanceOptions } from '@util/tables';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export const LocationsList = () => {
  const [expandedRowByToggle, setExpandedRowByToggle] = useState<string>();
  const { push } = useNavigation();

  const { tableProps } = useTable<LocationDto>({
    resource: ResourceType.LOCATIONS,
    sorters: DEFAULT_SORTERS,
    // filters: props.filters,
    metaData: {
      gqlQuery: LOCATIONS_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(LocationDto),
  });

  const handleExpandToggle = (record: LocationDto) => {
    setExpandedRowByToggle((prev) =>
      prev === record.id ? undefined : record.id,
    );
  };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    console.log(info?.source, value);
  };

  return (
    <Col>
      <Row justify="space-between" align="middle" className="header-row">
        <h2>Locations</h2>
        <Row>
          <Button
            type="primary"
            style={{ marginRight: '20px' }}
            onClick={() => push('/locations/new')}
          >
            Add New Location
            <PlusIcon />
          </Button>
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </Row>
      </Row>
      <Table
        rowKey="id"
        {...tableProps}
        showHeader={false}
        expandable={{
          expandIconColumnIndex: -1,
          expandedRowRender: (record: LocationDto) => {
            if (expandedRowByToggle === record.id) {
              return <LocationsChargignStationsTable record={record} />;
            }
            return null;
          },
          expandedRowKeys: expandedRowByToggle ? [expandedRowByToggle] : [],
        }}
        rowClassName={(record: LocationDto) =>
          expandedRowByToggle === record.id ? 'selected-row' : ''
        }
      >
        <Table.Column
          key="id"
          dataIndex="id"
          title="ID"
          sorter={true}
          onCell={() => ({
            className: 'column-id',
          })}
          render={(_: any, record: LocationDto) => {
            return (
              <Col>
                <Row>
                  <h4>{record.name}</h4>
                </Row>
                <Row>ID: {record.id}</Row>
              </Col>
            );
          }}
        />
        <Table.Column
          key="address"
          dataIndex="address"
          title="Address"
          onCell={() => ({
            className: 'column-address',
          })}
        />
        <Table.Column
          key="city"
          dataIndex="city"
          title="City"
          onCell={() => ({
            className: 'column-city',
          })}
        />
        <Table.Column
          key="postalCode"
          dataIndex="postalCode"
          title="Postal Code"
          onCell={() => ({
            className: 'column-postalCode',
          })}
        />
        <Table.Column
          key="state"
          dataIndex="state"
          title="State"
          onCell={() => ({
            className: 'column-state',
          })}
        />
        <Table.Column
          key="actions"
          dataIndex="actions"
          title="Actions"
          onCell={() => ({
            className: 'column-actions',
          })}
          render={(_: any, record: LocationDto) => (
            <Col>
              <Row justify="end" align="middle">
                <Button
                  key={`${record.id}-show-button`}
                  size="small"
                  type="link"
                  onClick={() => push(`/locations/${record.id}`)}
                  icon={<EyeIcon />}
                />
                <Button
                  key={`${record.id}-edit-button`}
                  size="small"
                  type="link"
                  onClick={() => push(`/locations/${record.id}/edit`)}
                  icon={<EditIcon />}
                />
                <DeleteButton
                  hideText
                  key={`${record.id}-delete-button`}
                  size="small"
                  type="link"
                  recordItemId={record.id}
                  resource={ResourceType.LOCATIONS}
                  meta={{
                    gqlMutation: LOCATIONS_DELETE_MUTATION,
                  }}
                  icon={<TrashIcon />}
                />
              </Row>
              <Row
                className="view-charging-stations"
                justify="end"
                align="middle"
                onClick={() => handleExpandToggle(record)}
              >
                View All Charging Stations
                <ArrowDownIcon
                  className={
                    expandedRowByToggle === record.id ? 'arrow rotate' : 'arrow'
                  }
                />
              </Row>
            </Col>
          )}
        />
      </Table>
    </Col>
  );
};
