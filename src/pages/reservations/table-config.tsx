import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { RESERVATIONS_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { Reservations } from '../../graphql/schema.types';
import { renderAssociatedStationId } from '../charging-stations';
import { TimestampDisplay } from '../../components/timestamp-display';
import React from 'react';
import GenericTag from '../../components/tag';
import { OCPP2_0_1 } from '@citrineos/base';
import { StatusIcon } from '../../components/status-icon';
import { DefaultColors } from '@enums';

export const RESERVATIONS_COLUMNS = (
  withActions: boolean,
  _parentView?: ResourceType,
): TableColumnsType<Reservations> => {
  const baseColumns: TableColumnsType<Reservations> = [
    {
      dataIndex: 'databaseId',
      title: 'Database ID',
      sorter: true,
    },
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      render: renderAssociatedStationId as any,
    },
    {
      dataIndex: 'expiryDateTime',
      title: 'Expiry Date Time',
      render: (_: any, record: Reservations) => (
        <TimestampDisplay isoTimestamp={record.expiryDateTime} />
      ),
    },
    {
      dataIndex: 'connectorType',
      title: 'Connector Type',
      render: ((_: any, record: Reservations) => {
        return (
          <GenericTag
            enumValue={record.connectorType as OCPP2_0_1.ConnectorEnumType}
            enumType={OCPP2_0_1.ConnectorEnumType}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'reserveStatus',
      title: 'Reserve Status',
      render: ((_: any, record: Reservations) => {
        return (
          <GenericTag
            enumValue={
              record.reserveStatus as OCPP2_0_1.ReserveNowStatusEnumType
            }
            enumType={OCPP2_0_1.ReserveNowStatusEnumType}
            colorMap={{
              Accepted: DefaultColors.GREEN,
              Faulted: DefaultColors.RED,
              Occupied: DefaultColors.BLUE,
              Rejected: DefaultColors.VOLCANO,
              Unavailable: DefaultColors.GOLD,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'isActive',
      title: 'Is Active',
      align: 'center',
      render: (_: any, record: Reservations) => (
        <StatusIcon value={record?.isActive} />
      ),
    },
    {
      dataIndex: 'terminatedByTransaction',
      title: 'Terminated By Transaction',
    },
    {
      dataIndex: 'evseId',
      title: 'Evse ID',
      // TODO: renderAssociatedEvseId
    },
  ] as any;

  if (withActions) {
    baseColumns.push({
      dataIndex: 'actions',
      title: 'Actions',
      render: (_: any, record: any) => (
        <ActionsColumn
          record={record}
          idField={'databaseId'}
          gqlDeleteMutation={RESERVATIONS_DELETE_MUTATION}
        />
      ),
    } as any);
  }

  return baseColumns;
};
