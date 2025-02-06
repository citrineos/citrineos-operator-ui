import { LocationDto } from '../../../dtos/location.dto';
import { Row, Table } from 'antd';
import React from 'react';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import moment from 'moment';
import { useNavigation } from '@refinedev/core';

export interface LocationsChargignStationsTableProps {
  record: LocationDto;
}

export const LocationsChargignStationsTable = ({
  record,
}: LocationsChargignStationsTableProps) => {
  const { push } = useNavigation();
  return (
    <Table
      rowKey="id"
      className="table nested"
      dataSource={record.chargingStations}
      showHeader={false}
    >
      <Table.Column
        key="id"
        dataIndex="id"
        title="ID"
        sorter={true}
        onCell={() => ({
          className: 'column-id',
        })}
        render={(_: any, record: ChargingStationDto) => {
          return <Row>{record.id}</Row>;
        }}
      />
      <Table.Column
        key="isOnline"
        dataIndex="isOnline"
        title="Is Online"
        onCell={() => ({
          className: 'column-isOnline',
        })}
        render={(_: any, record: ChargingStationDto) => {
          return (
            <Row className={record.isOnline ? 'online' : 'offline'}>
              {record.isOnline ? 'Online' : 'Offline'}
            </Row>
          );
        }}
      />
      <Table.Column
        key="communication"
        dataIndex="communication"
        title="Communication"
        onCell={() => ({
          className: 'column-communication',
        })}
        render={(_: any, record: ChargingStationDto) => {
          let msg = 'N/A';
          const latestStatusNotifications = record.latestStatusNotifications;
          if (latestStatusNotifications) {
            const latestStatusNotification = latestStatusNotifications[0];
            if (latestStatusNotification) {
              const statusNotification =
                latestStatusNotification.statusNotification;
              if (statusNotification) {
                const status = statusNotification.connectorStatus;
                const timestamp = moment(statusNotification.timestamp).format(
                  'YYYY-MM-DD HH:mm:ss',
                );
                const evseId = statusNotification.evseId;
                const connectorId = statusNotification.connectorId;
                msg = `${evseId} | ${connectorId} - ${status}: ${timestamp}`;
              }
            }
          }
          return <Row>{msg}</Row>;
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
          return <Row>Model</Row>;
        }}
      />
      <Table.Column
        key="vendor"
        dataIndex="vendor"
        title="Vendor"
        onCell={() => ({
          className: 'column-vendor',
        })}
        render={(_: any, record: ChargingStationDto) => {
          return <Row>Vendor</Row>;
        }}
      />
      <Table.Column
        key="details"
        dataIndex="details"
        title="Details"
        onCell={() => ({
          className: 'column-details',
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
  );
};
