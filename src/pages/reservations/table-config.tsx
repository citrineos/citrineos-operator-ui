// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { RESERVATIONS_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { Reservations } from '../../graphql/schema.types';
import { TimestampDisplay } from '../../components/timestamp-display';
import React from 'react';
import GenericTag from '../../components/tag';
import { ConnectorEnumType, ReserveNowStatusEnumType } from '@OCPP2_0_1';
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
      // render: renderAssociatedStationId as any,
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
            enumValue={record.connectorType as ConnectorEnumType}
            enumType={ConnectorEnumType}
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
            enumValue={record.reserveStatus as ReserveNowStatusEnumType}
            enumType={ReserveNowStatusEnumType}
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
